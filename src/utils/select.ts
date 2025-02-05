import { trans } from "@mongez/localization";
import Is from "@mongez/supportive-is";
import {
  lengthRule,
  maxLengthRule,
  minLengthRule,
  requiredRule,
} from "@mongez/validator";
import { currentLocaleCode } from "./helpers";
import { getLocalizedValue } from "./localization";

export function defaultMapOption(option: any, _index: number): any {
  if (Is.scalar(option)) {
    option = {
      label: typeof option === "string" ? trans(option) : String(option),
      value: String(option),
    };
  }

  const label = getLocalizedValue(
    option.name || option.text || option.title || option.label,
    currentLocaleCode()
  );

  return {
    label: label,
    value: String(option.id || option.value),
  };
}

export function mapData(data: any[], except?: any[], mapOption?: any): any[] {
  if (!data) return [];

  if (except) {
    except = except.map(String);
  }

  return data
    .map((value, index) => {
      const output = (mapOption || defaultMapOption)(value, index);

      return {
        ...output,
        value: String(output.value),
      };
    })
    .filter((option: any) => {
      if (!except) return true;

      return except.includes(option.value) === false;
    });
}

export const defaultSelectProps = {
  type: "select",
  searchable: true,
  autoSelectSingleOption: true,
  autoSelectFirstOption: false,
  rules: [requiredRule, minLengthRule, maxLengthRule, lengthRule],
};
