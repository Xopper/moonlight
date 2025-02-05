import { Col, Grid } from "@mantine/core";
import { transFrom } from "@mongez/localization";
import { HiddenInput } from "@mongez/react-form";
import { get } from "@mongez/reinforcements";
import { getMoonlightConfig } from "../../config";
import { getLocaleCodes } from "../../utils/localization";
import { InputBuilder } from "./InputBuilder";
import { InputRenderer } from "./InputRenderer";

export class MultiLingualBuilder extends InputBuilder {
  /**
   * Input builder
   */
  protected input!: InputBuilder;

  /**
   * Set input builder
   */
  public setInput(input: InputBuilder) {
    this.input = input;
    return this;
  }

  /**
   * {@inheritdoc}
   */
  public render() {
    if (this.content) {
      return this.content;
    }

    const size = "auto";

    this.input.setRecord(this.record);

    const value = get(this.record, this.input.name());

    const localeCodesList = getMoonlightConfig("localeCodes", {});

    const getFromValue = () => {
      const localeCodes: any[] = [];

      for (const localeCodeData of value) {
        const localeCode = localeCodesList[localeCodeData.localeCode] as any;

        localeCode.localeCode = localeCodeData.localeCode;

        if (localeCode) {
          localeCodes.push(localeCode);
        }
      }

      return localeCodes;
    };

    const localeCodes = value ? getFromValue() : getLocaleCodes();

    const renderedComponents = localeCodes.map((localeCodeObject, index) => {
      const { localeCode } = localeCodeObject;
      const input = this.input.clone();

      if (input.isAutoFocused() && index > 0) {
        input.autoFocus(false);
      }

      const originalName = input.name();

      const inputName = originalName + "." + index;

      input
        .setName(inputName + ".text")
        .description(
          <>
            {this._description
              ? typeof this._description === "string"
                ? transFrom(localeCode, this._description)
                : this._description
              : null}
            {`${localeCodeObject.name} (${localeCode})`}
          </>,
        )
        .label(
          transFrom(localeCode, input.data.label.value || originalName),
          false,
        )
        .updateComponentProps({
          dir: localeCodeObject.direction,
        })
        .setDefaultValueKey(`${inputName}.text`)
        .placeholder(
          transFrom(localeCode, input.data.placeholder.value || originalName),
          false,
        );

      if (this._hint) {
        input.hint(
          typeof this._hint === "string"
            ? transFrom(localeCode, this._hint)
            : this._hint,
        );
      }

      const content = (
        <Grid.Col span={size} key={input.name() + localeCode}>
          <HiddenInput name={`${inputName}.localeCode`} value={localeCode} />

          {input.render()}
        </Grid.Col>
      );

      return content;
    });

    const { wrapperProps } = this.prepareRendering();

    wrapperProps.span = 12;

    this.content = (
      <InputRenderer
        Wrapper={Col}
        inputBuilder={this}
        key={this._key}
        wrapperProps={wrapperProps}>
        <Grid>{renderedComponents}</Grid>
      </InputRenderer>
    );

    return this.content;
  }
}
