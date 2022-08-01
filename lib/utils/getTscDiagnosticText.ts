import ts from 'typescript';

const getTscDiagnosticText = function ({ diagnosticCode }: {
  diagnosticCode: number;
}): string {
  const messageForCode = Object.values((ts as any).Diagnostics as Record<string, ts.DiagnosticMessage>).
    find((diagnosticMessage): boolean => diagnosticMessage.code === diagnosticCode)?.message ?? `Unknown error`;

  return `error TS${diagnosticCode}: ${messageForCode}`;
};

export {
  getTscDiagnosticText
};
