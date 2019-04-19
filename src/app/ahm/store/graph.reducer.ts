// import {ADD_CRITERIA, ADD_OPTION, AhmAction, CHANGE_CRITERION_RELEVANCE, CHANGE_OPTIONS_RELEVANCE} from './ahm.actions';
// import {RelevanceGraph} from "../models/relevance-graph.model";
//
// export function graphReducer(state: RelevanceGraph = {}, action: AhmAction): RelevanceGraph {
//   switch (action.type) {
//     case ADD_CRITERIA:
//     case ADD_OPTION:
//       return Object.entries(state).reduce((acc, [name, value]) => (acc[name] = {...value, [action.name]: 1}, acc),
//         {[action.name]: Object.keys(state).reduce((acc, key) => (acc[key] = 1, acc), {})});
//
//     case CHANGE_OPTIONS_RELEVANCE:
//       return {
//         ...state,
//         optionsRelevances: {
//           ...state.optionsRelevances,
//           [action.criteria]: replaceRelevance(state.optionsRelevances[action.criteria], action.name1, action.name2, action.relevance)
//         }
//       };
//
//     case CHANGE_CRITERION_RELEVANCE:
//       const old = state[action.name1][action.name2];
//       if (align(old, action.relevance)) {
//         const diff = action.relevance / old;
//         return Object.entries(state).reduce((acc, [key, val]) => {
//           if (key === action.name1) {
//             acc[key] = {...val, [action.name2]: action.relevance};
//           } else if (key === action.name2) {
//             acc[key] = {...val, [action.name1]: 1 / action.relevance};
//           } else {
//             if (align(state[action.name1][key], state[key][action.name2])) {
//               const sqrtDiff = Math.sqrt(diff);
//
//             }
//           }
//           return acc;
//         }, {})
//       }
//
//     default:
//       return state;
//   }
// }
//
// function align(a: number, b: number) {
//   return a === 1 || b === 1 || a < 1 && b < 1 || a > 1 && b > 1;
// }
