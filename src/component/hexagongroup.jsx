import Hexagon from "react-hexagon";

const HexagonGroup = ({ img1, img2, img3 }) => {
  return (
    <>
      <div className="flex justify-center -translate-y-2.5">
        <Hexagon
          style={{ stroke: "white" }}
          className="w-12 h-12 mx-1"
          backgroundImage={img1}
          //backgroundScale={1.05}
        />
        <Hexagon
          style={{ stroke: "white" }}
          className="w-12 h-12 mx-1"
          backgroundImage={img2}
        />
      </div>
      <div className="flex justify-center -translate-y-2.5">
        <Hexagon
          style={{ stroke: "white" }}
          className="w-12 h-12"
          backgroundImage={img3}
        />
      </div>
    </>
  );
};

export default HexagonGroup;