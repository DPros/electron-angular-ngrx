// import {AhmState, initialAhmState} from './ahm.state';
// import {ADD_CRITERIA, ADD_OPTION, AhmAction, CHANGE_CRITERION_RELEVANCE, CHANGE_OPTIONS_RELEVANCE} from './ahm.actions';
// import {RelevanceMap} from '../models/relevance-map';
// import {collectToObject, Tuple} from '../utils/utils';
//
// export function ahmReducer(state: AhmState = initialAhmState, action: AhmAction): AhmState {
//   switch (action.type) {
//     case ADD_CRITERIA:
//       const newRelevanceMap: RelevanceMap = collectToObject(state.criterion.map(({name}) =>
//         <Tuple>[name, generateRelevancePair(name, action.name)]));
//       const optionPairs: string[][] = [];
//       for (let i = 0; i < state.options.length; i++) {
//         for (let j = i + 1; j < state.options.length; j++) {
//           optionPairs.push([state.options[i].name, state.options[j].name]);
//         }
//       }
//       const optionsRelevancesByNewCriteria: Record<string, RelevanceMap> =
//         collectToObject(state.options.map(({name}) => <Tuple>[name, {}]));
//       optionPairs.forEach(([a, b]) => {
//         const relevancePair = generateRelevancePair(a, b);
//         optionsRelevancesByNewCriteria[a][b] = relevancePair;
//         optionsRelevancesByNewCriteria[b][a] = relevancePair;
//       });
//       return {
//         ...state,
//         criterion: [
//           ...state.criterion,
//           {name: action.name}
//         ],
//         criterionRelevance: Object.entries(state.criterionRelevance)
//           .reduce((map, [name, relevanceMap]) => (map[name] = {
//             ...relevanceMap,
//             [action.name]: newRelevanceMap[name]
//           }, map), {[action.name]: newRelevanceMap}),
//         optionsRelevances: {
//           ...state.optionsRelevances,
//           [action.name]: optionsRelevancesByNewCriteria
//         }
//       };
//
//     case ADD_OPTION:
//       return {
//         ...state,
//         options: [...state.options,
//           {name: action.name, properties: {}}
//         ],
//         optionsRelevances: collectToObject(Object.entries(state.optionsRelevances).map(([criteria, relevancesByCriteria]) => {
//           const relevancesMapByCriteria = collectToObject(state.options.map(({name}) =>
//             <Tuple>[name, generateRelevancePair(name, action.name)]));
//           return <Tuple>[
//             criteria,
//             collectToObject([...Object.entries(relevancesByCriteria).map(([option, relevances]) => <Tuple>[
//               option,
//               {
//                 ...relevances,
//                 [action.name]: relevancesMapByCriteria[option]
//               },
//             ]), [action.name, relevancesMapByCriteria]])
//           ];
//         }))
//       };
//
//     case CHANGE_OPTIONS_RELEVANCE:
//       return {
//         ...state,
//         optionsRelevances: {
//           ...state.optionsRelevances,
//           [action.criteria]: changeRelevance(state.optionsRelevances[action.criteria], action.name1, action.name2, action.relevance)
//         }
//       };
//
//     case CHANGE_CRITERION_RELEVANCE:
//       return {
//         ...state,
//         criterionRelevance: changeRelevance(state.criterionRelevance, action.name1, action.name2, action.relevance)
//       };
//     default:
//       return state;
//   }
// }
//
// function generateRelevancePair(name1: string, name2: string, relevance: number = 1) {
//   return function (name: string) {
//     return name === name1 ? relevance : 1. / relevance;
//   };
// }
//
// function align(a: number, b: number) {
//   return a === 1 || b === 1 || a < 1 && b < 1 || a > 1 && b > 1;
// }
//
// function changeRelevance(state: Record<string, RelevanceMap>, name1: string, name2: string, relevance: number) {
//   const old = state[name1].get(name2);
//   if (align(old, relevance)) {
//     const diff = relevance / old;
//     return Object.entries(state).reduce((acc, [key, val]) => {
//       if (key === name1) {
//         acc[key] = {...val, [name2]: relevance};
//       } else if (key === action.name2) {
//         acc[key] = {...val, [action.name1]: 1 / action.relevance};
//       } else {
//         if (align(state[action.name1][key], state[key][action.name2])) {
//           const sqrtDiff = Math.sqrt(diff);
//
//         }
//       }
//       return acc;
//     }, {})
//   }
//   const newRelevance = generateRelevancePair(name1, name2, relevance);
//   return {
//     ...state,
//     [name1]: {
//       ...state[name1],
//       [name2]: newRelevance
//     },
//     [name2]: {
//       ...state[name2],
//       [name1]: newRelevance
//     }
//   };
// }
