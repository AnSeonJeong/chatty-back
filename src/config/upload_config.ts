import multer from "multer";
import path from "path";

// 파일을 디스크에 저장하기 위한 설정
type MulterFile = Express.Multer.File;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // 동적으로 폴더 경로 생성
    const subfolder = determineSubfolder(file);
    const uploadPath = path.join("uploads", subfolder);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});
// 파일 저장 폴더 경로를 지정
const determineSubfolder = (file: MulterFile) => {
  if (file.fieldname === "profile") {
    return "user/profiles";
  } else if (file.fieldname === "chatImage") {
    return "chat/images";
  } else if (file.fieldname === "chatDocument") {
    return "chat/documents";
  } else {
    return "others";
  }
};
const upload = multer({ storage: storage });

export default upload;
