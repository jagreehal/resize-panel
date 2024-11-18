declare namespace JSX {
  interface IntrinsicElements {
    'resize-panel': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    > & {
      // Attributes
      'outer-w'?: string;
      'outer-h'?: string;
      w?: string;
      h?: string;
      src?: string;
      'aria-label'?: string;
      'min-w'?: string;
      'max-w'?: string;
      'min-h'?: string;
      'max-h'?: string;
      scrolling?: 'auto' | 'yes' | 'no';
      'data-display-position'?:
        | 'top-left'
        | 'top-right'
        | 'bottom-left'
        | 'bottom-right'
        | 'none';
      'data-theme'?: 'light' | 'dark';
    };
  }
}
