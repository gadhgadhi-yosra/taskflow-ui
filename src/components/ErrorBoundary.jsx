// import React from 'react';

// export default class ErrorBoundary extends React.Component {
//   constructor(props){ super(props); this.state = { hasError:false, error:null }; }
//   static getDerivedStateFromError(error){ return { hasError:true, error }; }
//   componentDidCatch(err, info){ console.error('UI Error:', err, info); }
//   render(){
//     if(this.state.hasError){
//       return (
//         <div style={{padding:24,fontFamily:'system-ui'}}>
//           <h2>Une erreur est survenue dans l’UI</h2>
//           <pre style={{whiteSpace:'pre-wrap',background:'#f6f6f6',padding:12,borderRadius:8}}>
//             {String(this.state.error)}
//           </pre>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }

