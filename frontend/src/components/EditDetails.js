// import React, { useState } from "react";

// const EditDetails = ({ data }) => {
//   const [editedData, setEditedData] = useState(data);

//   const handleChange = (event) => {
//     setEditedData({ ...editedData, [event.target.name]: event.target.value });
//   };

//   return (
//     <div className="mt-4">
//       <h4>Extracted Details</h4>
//       {Object.keys(editedData).map((key) => (
//         <div key={key} className="mb-2">
//           <label>{key}:</label>
//           <input
//             type="text"
//             name={key}
//             value={editedData[key]}
//             onChange={handleChange}
//             className="form-control"
//           />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default EditDetails;
