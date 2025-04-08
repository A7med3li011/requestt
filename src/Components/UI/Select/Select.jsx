import React from "react";
import ReactSelect from "react-select";
import "../Input/Input.scss";
import ContentLoader from "../../Loader/ContentLoader";

const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: "white",
    border: "1px solid black",
    borderRadius: "10px",
    padding: "2px 5px",
    minHeight: "45px",
    boxShadow: "none",
    
    "&:hover": { borderColor: "black" },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#999",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: "black",
    "&:hover": { color: "black" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#CCABDA66" : "white",
    color: state.isSelected ? "var(--purple)" : "black",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "var(--purple)",
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "10px",
    marginTop: "4px",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
  }),
};

const Select = ({
  label,
  id,
  options = [],
  value,
  onChange,
  className,
  placeholder,
  isDisabled = false,
  isClearable = true,
  isSearchable = true,
  isMulti = false,
  loading = false,
  InputClassName = "",
  ...rest
}) => {
  const tags = options;

  // const tagsStyle = {
  //   control: (provided) => ({
  //     ...provided,
  //     backgroundColor: "white",
  //     border: "1px solid var(--purple)",
  //     borderRadius: "15px",
  //     padding: "5px",
  //     minHeight: "42px",
  //     boxShadow: "none",
  //     "&:hover": { borderColor: "var(--purple)" },
  //   }),
  //   placeholder: (provided) => ({
  //     ...provided,
  //     color: "#999",
  //   }),
  //   dropdownIndicator: (provided) => ({
  //     ...provided,
  //     color: "#FFDD94",
  //     "&:hover": { color: "#FFDD94" },
  //   }),
  //   indicatorSeparator: () => ({ display: "none" }),
  //   option: (provided, state) => ({
  //     ...provided,
  //     backgroundColor: state.isSelected ? "#CCABDA66" : "white",
  //     color: state.isSelected ? "var(--purple)" : "var(--gray)",
  //     padding: "10px",
  //     borderRadius: "8px",
  //     cursor: "pointer",
  //     "&:hover": {
  //       backgroundColor: "var(--purple)",
  //       color: "white",
  //     },
  //   }),
  //   menu: (provided) => ({
  //     ...provided,
  //     borderRadius: "10px",
  //     marginTop: "4px",
  //     boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
  //   }),
  //     const currentTag = tags.find((tag) => tag.value === state.data.value);
  //     return {
  //       ...provided,
  //       backgroundColor: `white`,

  //       borderRadius: "12px",
  //       padding: "3px 6px",
  //     };
  //   },
  //   multiValueLabel: (provided, state) => {
  //     const currentTag = tags.find((tag) => tag.value === state.data.value);
  //     return {
  //       ...provided,
  //       color: currentTag.colorCode,
  //     };
  //   },
  //   multiValueRemove: (provided, state) => {
  //     const currentTag = tags.find((tag) => tag.value === state.data.value);
  //     return {
  //       ...provided,
  //       color: "white",
  //       cursor: "pointer",
  //       "&:hover": {
  //         backgroundColor: `white`,
  //         color: currentTag.colorCode,
  //       },
  //     };
  //   },
  // };
  return (
    <div className={`Input_container flex flex-col ${className}`}>
      {label && (
        <label
          className="Input_label mb-1 flex items-center justify-start gap-2 font-jost text-base font-medium mx-2"
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <ReactSelect
        id={id}
        value={options.find((option) => option.value === value)}
        onChange={(selectedOption) => onChange(selectedOption?.value)}
        options={options}
        placeholder={loading ? "Loading..." : placeholder}
        isDisabled={isDisabled || loading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isMulti={isMulti}
        classNamePrefix="select"
        className={InputClassName}
        styles={ customStyles}
        isLoading={loading}
        {...rest}
      />
      {loading && (
        <div className="flex items-center justify-center mt-2">
          <ContentLoader />
        </div>
      )}
    </div>
  );
};

export default Select;
