import { trans } from "@mongez/localization";
import Helmet, { HelmetProps } from "@mongez/react-helmet";
import { useRequest } from "@mongez/react-hooks";
import { AxiosResponse } from "axios";
import React from "react";
import { LoadingErrorHandler } from "../components/LoadingErrorHandler";

export type HelmetData =
  | string
  | ((isLoading: boolean, response: AxiosResponse) => string);

export type PageOptions = {
  title: HelmetData;
  description?: HelmetData;
  image?: HelmetData;
  helmetProps?: Partial<HelmetProps>;
  request: (props: any) => Promise<AxiosResponse>;
  component: React.ComponentType;
};

export function setupPage(settings: PageOptions) {
  return function LoadPage(props: any) {
    const { response, isLoading, error } = useRequest(() =>
      settings.request(props),
    );

    const helmetData: any = {};

    for (const key of ["title", "description", "image"]) {
      const value = (settings as any)[key];
      if (value) {
        helmetData[key] =
          typeof value === "string" ? trans(value) : value(isLoading, response);
      }
    }

    let content: React.ReactNode;

    if (isLoading || error) {
      content = <LoadingErrorHandler isLoading={isLoading} error={error} />;
    } else {
      content = <settings.component {...props} response={response} />;
    }

    return (
      <>
        <Helmet
          {...(settings.helmetProps || {})}
          title={helmetData.title}
          description={helmetData.description}
          image={helmetData.image}
        />
        {content}
      </>
    );
  };
}
