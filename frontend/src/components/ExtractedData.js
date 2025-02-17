// export default function ExtractedData({ data, onEdit }) {
//     return (
//         <div className="mt-4">
//             <h4>Extracted Details</h4>
//             {Object.keys(data).map((key) => (
//                 <div key={key} className="mb-2">
//                     <label className="form-label">{key}:</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         value={data[key]}
//                         onChange={(e) => onEdit(key, e.target.value)}
//                     />
//                 </div>
//             ))}
//         </div>
//     );
// }
