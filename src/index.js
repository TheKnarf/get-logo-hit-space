import { dom, fragment } from "isomorphic-jsx";
import code from "./app.js";
import "./CNAME";

const root = document.createElement("div");
root.innerHTML = (
  <>
    <div id="text">
      <svg>
        <text x="0" y="25" fill="black">
          Get logo, hit space
        </text>
      </svg>
    </div>
    <div>test</div>
  </>
);
document.body.appendChild(root);

code();
