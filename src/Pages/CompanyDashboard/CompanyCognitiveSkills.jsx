import React, { useEffect } from "react";

const CompanyCognitiveSkills = (props) => {
  const handleTraitCheckboxChange = (event, trait) => {
    const updatedTraits = props.traits.map((t) => {
      if (t.name === trait.name) {
        return { ...t, selected: event.target.checked };
      }
      return t;
    });
    props.setTraits(updatedTraits);
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1, paddingRight: "10px" }}>
        <div
          className="w-full"
          style={{
            backgroundColor: "#228276",
            border: "1px solid #CCCCCC",
            borderRadius: "10px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {props.traits && props.traits.length > 0 ? (
              props.traits
                ?.slice(0, Math.ceil(props.traits.length / 2))
                .map((trait, index) => (
                  <div key={index}>
                    <label>
                      <input
                        type="checkbox"
                        value={trait.name}
                        onChange={(event) =>
                          handleTraitCheckboxChange(event, trait)
                        }
                        checked={trait.selected}
                        style={{ marginLeft: "10px" }}
                      />
                      <label className="py-2 px-6 text-md font-bold text-left text-white">
                        {" "}
                        {trait.name}{" "}
                      </label>
                    </label>
                  </div>
                ))
            ) : (
              <div>
                <p className="font-semibold text-white">
                  No cognitive skills available.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, paddingLeft: "10px" }}>
        <div
          className="w-full"
          style={{
            backgroundColor: "#228276",
            border: "1px solid #CCCCCC",
            borderRadius: "10px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {props.traits && props.traits.length > 0
              ? props.traits
                  ?.slice(Math.ceil(props.traits.length / 2))
                  .map((trait, index) => (
                    <div key={index}>
                      <label>
                        <input
                          type="checkbox"
                          value={trait.name}
                          onChange={(event) =>
                            handleTraitCheckboxChange(event, trait)
                          }
                          checked={trait.selected}
                          style={{ marginLeft: "10px" }}
                        />
                        <label className="py-2 px-6 text-md font-bold text-left text-white">
                          {" "}
                          {trait.name}
                        </label>
                      </label>
                    </div>
                  ))
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCognitiveSkills;
