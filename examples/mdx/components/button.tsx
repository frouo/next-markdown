import { PropsWithChildren } from 'react';

export default function Button({ children }: PropsWithChildren<{}>) {
  return (
    <button>
      <style jsx>{`
        button {
          border-radius: 3px;
          border: 1px solid black;
          color: black;
          padding: 0.5em 1em;
          cursor: pointer;
          font-size: 1.1em;
        }
        button:hover {
          background-color: #ddd;
        }
      `}</style>
      {children}
    </button>
  );
}
