import "./compareBar.scss";
import { useCompare } from "../../context/CompareContext";
import { useState } from "react";

function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [showModal, setShowModal] = useState(false);

  if (compareList.length === 0) return null;

  return (
    <>
      <div className="compareBar">
        <div className="items">
          {compareList.map((item) => (
            <div key={item.id} className="compareItem">
              <img src={item.images[0]} alt="" />
              <span>{item.title.substring(0, 15)}...</span>
              <button onClick={() => removeFromCompare(item.id)}>✕</button>
            </div>
          ))}
        </div>
        <div className="actions">
          <button className="clear" onClick={clearCompare}>Clear All</button>
          <button className="compareBtn" onClick={() => setShowModal(true)}>
            Compare Now ({compareList.length})
          </button>
        </div>
      </div>

      {showModal && (
        <div className="compareModal">
          <div className="modalContent">
            <div className="modalHeader">
              <h1>Property Comparison</h1>
              <button className="close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="comparisonTable">
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    {compareList.map(p => (
                      <th key={p.id}>{p.title}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Price</td>
                    {compareList.map(p => <td key={p.id}>${p.price}</td>)}
                  </tr>
                  <tr>
                    <td>Type</td>
                    {compareList.map(p => <td key={p.id} className="capitalize">{p.type}</td>)}
                  </tr>
                  <tr>
                    <td>Property</td>
                    {compareList.map(p => <td key={p.id} className="capitalize">{p.property}</td>)}
                  </tr>
                  <tr>
                    <td>Bedrooms</td>
                    {compareList.map(p => <td key={p.id}>{p.bedroom}</td>)}
                  </tr>
                  <tr>
                    <td>Bathrooms</td>
                    {compareList.map(p => <td key={p.id}>{p.bathroom}</td>)}
                  </tr>
                  <tr>
                    <td>City</td>
                    {compareList.map(p => <td key={p.id}>{p.city}</td>)}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompareBar;
