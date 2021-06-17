import { assert } from 'assertthat';
import { DependencyGraph } from '../../../lib/dataStructures/DependencyGraph';
import * as errors from '../../../lib/errors';

suite('DependencyGraph', (): void => {
  const rootOne = '/test/unit/a/oneTests.ts';
  const rootTwo = '/test/unit/a/twoTests.ts';
  const nodeOne = '/lib/a/one.ts';
  const nodeTwo = '/lib/a/two.ts';
  const nodeThree = '/lib/a/three.ts';

  test('can add root nodes.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    const addRootResult = graph.addRoot(rootOne);

    assert.that(addRootResult).is.aValue();
    assert.that(graph.hasRoot(rootOne)).is.true();
  });

  test('can not add the same root node multiple times.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    const addRootTwoTimesResult = graph.addRoot(rootOne);

    assert.that(addRootTwoTimesResult).is.anError();
    if (addRootTwoTimesResult.hasError()) {
      assert.that(addRootTwoTimesResult.error).is.instanceOf(errors.RootAlreadyInGraph);
    }
  });

  test('can remove root nodes.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    const removeRootResult = graph.removeRoot(rootOne);

    assert.that(removeRootResult).is.aValue();
    assert.that(graph.hasRoot(rootOne)).is.false();
  });

  test('cannot remove a root node that does not exist in the graph.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    const removeRootResult = graph.removeRoot(rootOne);

    assert.that(removeRootResult).is.anError();
    if (removeRootResult.hasError()) {
      assert.that(removeRootResult.error).is.instanceOf(errors.RootNotInGraph);
    }
  });

  test('can add edges, which results in the target node existing in the graph.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    const addEdgeResult = graph.addEdge(rootOne, nodeOne);

    assert.that(addEdgeResult).is.aValue();
    assert.that(graph.hasNode(nodeOne)).is.true();
  });

  test('can not add an edge whose source node does not exist in the graph.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    const addEdgeResult = graph.addEdge(rootOne, nodeOne);

    assert.that(addEdgeResult).is.anError();
    if (addEdgeResult.hasError()) {
      assert.that(addEdgeResult.error).is.instanceOf(errors.SourceNodeNotInGraph);
    }
  });

  test('can not add the same edge multiple times.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    graph.addEdge(rootOne, nodeOne);
    const addEdgeTwiceResult = graph.addEdge(rootOne, nodeOne);

    assert.that(addEdgeTwiceResult).is.anError();
    if (addEdgeTwiceResult.hasError()) {
      assert.that(addEdgeTwiceResult.error).is.instanceOf(errors.EdgeAlreadyInGraph);
    }
  });

  test('can update all edges starting from a node at once.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    graph.addEdge(rootOne, nodeOne);
    graph.addEdge(nodeOne, nodeThree);

    const updateEdgesFromNodeResult = graph.updateEdgesFromNode(nodeOne, new Set([ nodeTwo ]));

    assert.that(updateEdgesFromNodeResult).is.aValue();
    assert.that(graph.hasNode(nodeThree)).is.false();
    assert.that(graph.hasNode(nodeTwo)).is.true();
  });

  test('removing a root node purges unreachable nodes.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    graph.addEdge(rootOne, nodeOne);

    assert.that(graph.hasNode(nodeOne)).is.true();

    graph.removeRoot(rootOne);

    assert.that(graph.hasNode(nodeOne)).is.false();
  });

  test('removing a node does not remove the node itself, only its outgoing edges.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    graph.addEdge(rootOne, nodeOne);

    assert.that(graph.hasNode(nodeOne)).is.true();

    graph.removeNode(nodeOne);

    assert.that(graph.hasNode(nodeOne)).is.true();
  });

  test('removing a node purges unreachable nodes.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    graph.addEdge(rootOne, nodeOne);
    graph.addEdge(nodeOne, nodeTwo);
    graph.addEdge(nodeTwo, nodeThree);

    assert.that(graph.hasNode(nodeOne)).is.true();
    assert.that(graph.hasNode(nodeTwo)).is.true();
    assert.that(graph.hasNode(nodeThree)).is.true();

    graph.removeNode(nodeOne);

    assert.that(graph.hasNode(nodeOne)).is.true();
    assert.that(graph.hasNode(nodeTwo)).is.false();
    assert.that(graph.hasNode(nodeThree)).is.false();
  });

  test('removing a node does not purge reachable nodes.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    graph.addEdge(rootOne, nodeOne);
    graph.addEdge(nodeOne, nodeTwo);
    graph.addEdge(nodeTwo, nodeThree);
    graph.addEdge(rootOne, nodeThree);

    assert.that(graph.hasNode(nodeOne)).is.true();
    assert.that(graph.hasNode(nodeTwo)).is.true();
    assert.that(graph.hasNode(nodeThree)).is.true();

    graph.removeNode(nodeOne);

    assert.that(graph.hasNode(nodeOne)).is.true();
    assert.that(graph.hasNode(nodeTwo)).is.false();
    assert.that(graph.hasNode(nodeThree)).is.true();
  });

  test('removing an edge purges unreachable nodes.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    graph.addEdge(rootOne, nodeOne);
    graph.addEdge(nodeOne, nodeTwo);
    graph.addEdge(nodeTwo, nodeThree);

    assert.that(graph.hasNode(nodeOne)).is.true();
    assert.that(graph.hasNode(nodeTwo)).is.true();
    assert.that(graph.hasNode(nodeThree)).is.true();

    graph.removeEdge(rootOne, nodeOne);

    assert.that(graph.hasNode(nodeOne)).is.false();
    assert.that(graph.hasNode(nodeTwo)).is.false();
    assert.that(graph.hasNode(nodeThree)).is.false();
  });

  test('can find all roots connected to a node.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);
    graph.addRoot(rootTwo);
    graph.addEdge(rootOne, nodeOne);
    graph.addEdge(rootTwo, nodeTwo);
    graph.addEdge(nodeOne, nodeThree);
    graph.addEdge(nodeTwo, nodeThree);

    const findRootsResult = graph.findRoots(nodeThree);

    assert.that(findRootsResult).is.aValue();
    assert.that(findRootsResult.unwrapOrThrow()).is.equalTo(new Set([ rootOne, rootTwo ]));
  });

  test('can find roots nodes even when starting from a root node.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    graph.addRoot(rootOne);

    const findRootsResult = graph.findRoots(rootOne);

    assert.that(findRootsResult).is.aValue();
    assert.that(findRootsResult.unwrapOrThrow()).is.equalTo(new Set([ rootOne ]));
  });

  test('cannot find roots from a node that does not exist in the graph.', async (): Promise<void> => {
    const graph = new DependencyGraph();

    const findRootsResult = graph.findRoots(nodeOne);

    assert.that(findRootsResult).is.anError();
    if (findRootsResult.hasError()) {
      assert.that(findRootsResult.error).is.instanceOf(errors.NodeNotInGraph);
    }
  });
});
