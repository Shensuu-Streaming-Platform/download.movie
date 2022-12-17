import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { ERROR, PLAYLIST, SEGMENT } from "../constant";
import parseHls from "../lib/parseHls";
import Layout from "./layout";

export default function HomePage({ seturl }) {
  const [text, settext] = useState("");
  const [playlist, setplaylist] = useState();

  async function validateAndSetUrl() {
    toast.loading(`Validating...`, { duration: 800 });
    let data = await parseHls({ hlsUrl: text });
    if (data.type === ERROR) {
      toast.error(data.data);
    } else if (data.type === PLAYLIST) {
      if (!data.data.length) {
        toast.error(`No playlist found in the url`);
      } else {
        setplaylist(data.data);
      }
    } else if (data.type === SEGMENT) {
      seturl(text);
    }
  }

  return (
    <>
      <Layout>
        <h1 className="text-3xl lg:text-4xl font-bold">HLS Downloader</h1>
        <h2 className="mt-2 max-w-lg text-center md:text-lg text-sm">
          Download hls videos in your browser. Please enter your{" "}
          <code className="border boder-gray-200 bg-gray-100 px-1 rounded-sm">
            .m3u8
          </code>{" "}
          uri to continue. Please don't use this service for piracy.
        </h2>

        <div className="w-full max-w-3xl mt-5 mb-4">
          <TextField
            label="Paste hls url"
            fullWidth
            size="small"
            placeholder="Please note it should have .m3u8 in the url"
            value={text}
            onChange={(e) => settext(e.target.value)}
          />
        </div>

        <button
          className="px-4 py-1.5 bg-gray-900 hover:bg-gray-700 text-white rounded-md"
          onClick={validateAndSetUrl}
        >
          Download
        </button>

        <i className="max-w-sm text-xs text-gray-500 text-center mt-2.5">
          * by clicking the above <b>Download</b> button you are agreed that you
          won't use this service for piracy.
        </i>
      </Layout>

      <Dialog open={playlist !== undefined} fullWidth maxWidth="sm">
        <DialogTitle className="flex justify-between">
          <span className="text-xl font-bold">Select quality</span>
          <button className="text-sm" onClick={() => setplaylist()}>
            Close
          </button>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-wrap justify-center items-center">
            {(playlist || []).map((item) => {
              return (
                <div
                  className="flex justify-between items-center mt-2"
                  key={item.bandwidth}
                >
                  <button
                    className="mr-2 px-2 py-1 rounded-md bg-black text-white"
                    onClick={() => seturl(item.uri)}
                  >
                    {item.name}
                  </button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}