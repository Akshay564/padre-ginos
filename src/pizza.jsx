import React from "react";

const Pizza = ({ name, description, image }) => {
  console.log("Pizza rendered");

  return (
    <div className="pizza">
      <h1>{name}</h1>
      <p>{description}</p>
      <div>
        <img src={image} alt={name} />
      </div>
    </div>
  );
};

export default React.memo(Pizza);
