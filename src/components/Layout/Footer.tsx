"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <div className="grow"></div>

      <footer className="bg-white dark:bg-[#0c1427] rounded-t-md px-[20px] md:px-[25px] py-[15px] md:py-[20px] text-center">
        <p>
          © 11F OS (Operating System) |{" "}
          <a
            href="https://11f.uk"
            target="_blank"
            className="text-primary-500 transition-all hover:underline"
          >
            11f.uk
          </a>
          {" "}|{" "}
          <a
            href="mailto:s@11f.uk"
            className="text-primary-500 transition-all hover:underline"
          >
            s@11f.uk
          </a>
        </p>
      </footer>
    </>
  );
};

export default Footer;
