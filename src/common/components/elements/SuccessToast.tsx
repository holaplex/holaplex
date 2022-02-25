import { FC } from "react";
import { Check } from "../icons/Check";

export const SuccessToast: FC = ({ children }) => {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center text-white">
          <Check color="#32D583" className="mr-2" />
          <div>{children}</div>
        </div>
      </div>
    );
  };