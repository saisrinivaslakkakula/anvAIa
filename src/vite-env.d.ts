/// <reference types="vite/client" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare module 'react' {
  export = React;
  export as namespace React;
}

declare module 'react/jsx-runtime' {
  export = React;
  export as namespace React;
}

declare module 'react-dom/client' {
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare module './index.css' {
  const content: string;
  export default content;
}

declare global {
  interface ImportMeta {
    env: {
      readonly VITE_APP_TITLE: string;
      readonly VITE_API_BASE_URL: string;
      readonly [key: string]: string | undefined;
    };
  }
  
  namespace React {
    interface JSX {
      IntrinsicElements: any;
    }
  }
  
  namespace ReactDOM {
    interface Root {
      render(children: React.ReactElement): void;
    }
    
    function createRoot(container: Element | null): Root;
  }
}
