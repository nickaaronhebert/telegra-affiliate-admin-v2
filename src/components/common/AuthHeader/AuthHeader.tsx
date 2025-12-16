import { TelegraLogo } from "@/assets/icons/TelegraLogo";
import React from "react";

type AuthHeaderProps = {
  title: string;
  description?: string;
  secondaryDescription?: string;
};

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  description,
  secondaryDescription,
}) => {
  return (
    <div className="text-center my-8">
      <div className="flex justify-center mb-[40px]">
        <TelegraLogo />
      </div>
      <h1 className="text-secondary-foreground font-semibold text-[26px] leading-[30px] mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-muted-foreground font-normal text-[16px] leading-[22px]">
          {description}
        </p>
      )}
      {secondaryDescription && (
        <p className="font-semibold max-w-[392px] mx-auto text-[16px] md:text-[18px] leading-[23px] md:leading-[26px] text-black mt-4">
          {secondaryDescription}
        </p>
      )}
    </div>
  );
};

export default AuthHeader;
