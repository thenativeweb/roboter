import { error, Result, value } from 'defekt';
import * as errors from '../errors';

class DependencyGraph {
  protected roots: Set<string>;

  protected edges: Map<string, Set<string>>;

  protected backEdges: Map<string, Set<string>>;

  public constructor () {
    this.roots = new Set<string>();
    this.edges = new Map<string, Set<string>>();
    this.backEdges = new Map<string, Set<string>>();
  }

  public addRoot (filePath: string): Result<undefined, errors.RootAlreadyInGraph> {
    if (this.roots.has(filePath)) {
      return error(new errors.RootAlreadyInGraph());
    }

    this.roots.add(filePath);

    return value();
  }

  public removeRoot (filePath: string): Result<undefined, errors.RootNotInGraph> {
    if (!this.roots.has(filePath)) {
      return error(new errors.RootNotInGraph());
    }

    this.roots.delete(filePath);
    if (this.edges.has(filePath)) {
      for (const target of this.edges.get(filePath)!) {
        this.removeEdge(filePath, target).unwrapOrThrow();
      }
    }

    return value();
  }

  public hasRoot (filePath: string): boolean {
    return this.roots.has(filePath);
  }

  public addEdge (source: string, target: string): Result<undefined, errors.SourceNodeNotInGraph | errors.EdgeAlreadyInGraph> {
    if (!this.hasNode(source)) {
      return error(new errors.SourceNodeNotInGraph());
    }
    const edgesFromSource = this.edges.get(source) ?? new Set<string>();

    if (edgesFromSource.has(target)) {
      return error(new errors.EdgeAlreadyInGraph());
    }

    edgesFromSource.add(target);

    this.edges.set(source, edgesFromSource);

    const backEdgesFromTarget = this.backEdges.get(target) ?? new Set<string>();

    backEdgesFromTarget.add(source);

    this.backEdges.set(target, backEdgesFromTarget);

    return value();
  }

  public updateEdgesFromNode (source: string, targets: Set<string>): Result<undefined, errors.SourceNodeNotInGraph> {
    if (!this.hasNode(source)) {
      return error(new errors.SourceNodeNotInGraph());
    }

    if (!this.edges.has(source)) {
      this.edges.set(source, new Set<string>());
    }

    const currentEdges = this.edges.get(source)!;
    const newEdges = new Set<string>();
    const obsoleteEdges = new Set<string>();

    for (const target of targets) {
      if (currentEdges.has(target)) {
        continue;
      }
      newEdges.add(target);
    }
    for (const currentEdge of currentEdges) {
      if (targets.has(currentEdge)) {
        continue;
      }
      obsoleteEdges.add(currentEdge);
    }

    for (const newEdge of newEdges) {
      this.addEdge(source, newEdge);
    }
    for (const obseleteEdge of obsoleteEdges) {
      this.removeEdge(source, obseleteEdge);
    }

    return value();
  }

  public removeEdge (source: string, target: string): Result<undefined, errors.EdgeNotInGraph> {
    if (!this.edges.get(source)?.has(target)) {
      return error(new errors.EdgeNotInGraph());
    }

    this.edges.get(source)!.delete(target);
    this.backEdges.get(target)!.delete(source);

    if (this.backEdges.get(target)!.size === 0) {
      this.removeNode(target).unwrapOrThrow();
      this.backEdges.delete(target);
    }

    return value();
  }

  public removeNode (filePath: string): Result<undefined, errors.CannotImplicitlyRemoveRoots | errors.NodeNotInGraph> {
    if (this.hasRoot(filePath)) {
      return error(new errors.CannotImplicitlyRemoveRoots());
    }
    if (!this.hasNode(filePath)) {
      return error(new errors.NodeNotInGraph());
    }

    const edgesFromNode = this.edges.get(filePath);

    // Not all nodes in the graph have a collection of outgoing edges. If there
    // is none, we are done here.
    if (!edgesFromNode) {
      return value();
    }

    for (const target of edgesFromNode) {
      this.removeEdge(filePath, target).unwrapOrThrow();
    }

    this.edges.delete(filePath);

    return value();
  }

  // Every node in the graph is either a root node or the source of a back-edge.
  public hasNode (filePath: string): boolean {
    if (this.roots.has(filePath)) {
      return true;
    }
    if (this.backEdges.has(filePath)) {
      return true;
    }

    return false;
  }

  public findRoots (filePath: string): Result<Set<string>, errors.NodeNotInGraph> {
    if (!this.hasNode(filePath)) {
      return error(new errors.NodeNotInGraph());
    }
    if (this.hasRoot(filePath)) {
      return value(new Set([ filePath ]));
    }

    const visitedDependents = new Set<string>();
    const currentDependents = [ filePath ];
    const foundRoots = new Set<string>();

    while (currentDependents.length > 0) {
      const currentDependent = currentDependents.pop()!;
      const nextDependents = this.backEdges.get(currentDependent)!;

      for (const nextDependent of nextDependents) {
        if (visitedDependents.has(nextDependent)) {
          continue;
        }
        if (this.hasRoot(nextDependent)) {
          foundRoots.add(nextDependent);
          continue;
        }
        currentDependents.push(nextDependent);
      }

      visitedDependents.add(currentDependent);
    }

    return value(foundRoots);
  }

  public prettyPrint (): string {
    const filePaths = [ ...this.edges.keys() ];

    filePaths.sort((left, right): number => left.localeCompare(right));

    let stringRepresentation = '';

    for (const filePath of filePaths) {
      stringRepresentation += `${filePath} =>\n`;
      for (const importPath of this.edges.get(filePath)!) {
        stringRepresentation += `  ${importPath}\n`;
      }
    }

    return stringRepresentation;
  }
}

export {
  DependencyGraph
};
