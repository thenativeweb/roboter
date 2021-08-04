import { buntstift } from 'buntstift';
import { DependencyGraph } from '../../types/DependencyGraph';
import { findImportsInSourceFile } from '../../utils/findImportsInSourceFile';

const updateDependencyGraph = async function ({ graph, staleFiles }: {
  graph: DependencyGraph;
  staleFiles: string[];
}): Promise<void> {
  while (staleFiles.length > 0) {
    const nextFile = staleFiles.pop()!;

    const analysisResult = await findImportsInSourceFile({ filePath: nextFile });

    if (analysisResult.hasError()) {
      continue;
    }

    const importedFilePaths = analysisResult.value;

    for (const importedFilePath of importedFilePaths) {
      if (!graph.hasNode(importedFilePath)) {
        staleFiles.unshift(importedFilePath);
      }
    }
    graph.updateEdgesFromNode(nextFile, importedFilePaths);
  }

  buntstift.verbose(graph.prettyPrint());
};

export {
  updateDependencyGraph
};
