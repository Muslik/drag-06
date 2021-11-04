declare module '*.svg' {
  const content: React.FC;
  export default content;
}

declare module '*.scss' {
  const styles: { [className: string]: string };
  export default styles;
}

declare const INITIAL_STATE: Record<string, unknown>;
