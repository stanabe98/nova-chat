import React from "react";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import "../../components/styles.css";

const CustomInput = ({
  visible,
  setState,
  placeholder,
  password,
  moreStyles,
  onChange,
  value,
}) => {
  return (
    <div
      className={`flex items-center bg-slate-700 rounded-md custom-inputLogindiv border border-black ${moreStyles}`}
    >
      <input
        placeholder={placeholder}
        type={visible ? "" : "password"}
        value={value}
        className="w-full bg-slate-700  pl-2 py-2 w-full rounded-md mr-1 text-white text-sm"
        onChange={onChange}
      />

      {password ? (
        visible ? (
          <EyeOutlined
            className="mr-2"
            style={{ fontSize: "0.9rem" }}
            onClick={() => setState(false)}
          />
        ) : (
          <EyeInvisibleOutlined
            className="mr-2"
            style={{ fontSize: "0.9rem" }}
            onClick={() => setState(true)}
          />
        )
      ) : (
        <></>
      )}
    </div>
  );
};

export default CustomInput;
