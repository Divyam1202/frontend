import React from "react";

const VirtualRealityIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <g id="BULINE">
      <circle
        id="XMLID_2_"
        style={{ fill: "#AC60FC" }} // Corrected
        cx="256"
        cy="256"
        r="256"
      />
    </g>
    <g id="Icons">
      <g id="XMLID_2028_">
        <path
          id="XMLID_2046_"
          style={{ fill: "#A85C3B" }} // Corrected
          d="M92.907,329.108H35.174c-9.257,0-16.761-7.504-16.761-16.761v-76.729
                    c0-9.257,7.504-16.761,16.761-16.761h57.733V329.108z"
        />
        <path
          id="XMLID_2045_"
          style={{ fill: "#A04830" }} // Corrected
          d="M92.911,218.855V329.11H35.174c-9.257,0-16.761-7.504-16.761-16.761v-9.319h0
                    c25.099,0,45.445-20.346,45.445-45.445v-38.73H92.911z"
        />
        {/* Other elements... */}
      </g>
    </g>
  </svg>
);

export default VirtualRealityIcon;
