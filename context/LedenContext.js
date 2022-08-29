import { createContext, useState } from "react";
import { useContext } from "react";
import ApiContext from "./ApiContext";

const LedenContext = createContext({
  leden: [{}],
  setLeden: [],
  GET: async () => {},
  POST: async (leden) => {},
  PUT: async (leden) => {},
  DELETE: async (leden) => {},
  SEARCH: async (leden) => {},
});
export default LedenContext;

export const LedenProvider = ({ children }) => {
  const { ApiRequest } = useContext(ApiContext);
  const [leden, setLeden] = useState([]);
  async function GET() {
    setLeden([]);
    const { res, data } = await ApiRequest("/leden/");
    setLeden(data);
  }
  async function POST(leden) {
    const { res, data } = await ApiRequest("/leden/", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify(leden),
    });
    setLeden([...leden, data]);
  }
  async function PUT(leden) {
    const { res, data } = await ApiRequest(`/leden/${leden.id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(leden),
    });
    setLeden(
      leden.map((leden_from_map) =>
        leden.id === leden_from_map.id ? data : leden_from_map
      )
    );
  }
  async function DELETE(leden) {
    await ApiRequest(`/leden/${leden.id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    });
  }
  const data = {
    leden: leden,
    setLeden: setLeden,
    GET: GET,
    POST: POST,
    PUT: PUT,
    DELETE: DELETE,
  };
  return <LedenContext.Provider value={data}>{children}</LedenContext.Provider>;
};
