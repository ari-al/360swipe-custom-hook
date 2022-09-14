import fs from "fs";
import path from "path";

const imageDirectory = path.join(process.cwd(), "posts");

export async function getFittingImageData() {
  const fullPath = path.join(imageDirectory, `SEQ.0000.png`);
  fs.readFile(fullPath, function (error, data) {
    if (error) {
      response.writeHead(500, { "Content-Type": "text/html" });
      response.end("500 Internal Server " + error);
    } else {
      // 6. Content-Type 에 4번에서 추출한 mime type 을 입력
      response.writeHead(200, { "Content-Type": "image/png" });
      response.end(data);
    }
  });
}
