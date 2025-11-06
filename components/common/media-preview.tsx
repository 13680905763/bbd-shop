import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaTimes, FaPlay } from "react-icons/fa";

export type MediaItem = {
  id: string | number;
  fileUrl: string;
};

type MediaPreviewGroupProps = {
  fileList?: MediaItem[];
  thumbnailSize?: number; // 缩略图大小
};

const MediaPreviewGroup: React.FC<MediaPreviewGroupProps> = ({
  fileList = [],
  thumbnailSize = 40,
}) => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!fileList || fileList.length === 0) return null;

  const isVideo = (url?: string) =>
    url?.match(/\.(mp4|mov|avi|mkv)$/i) !== null;

  const openPreview = (index: number) => {
    if (index < 0 || index >= fileList.length) return;
    setCurrentIndex(index);
    setPreviewVisible(true);
  };

  const prev = () =>
    setCurrentIndex((i) => (i - 1 + fileList.length) % fileList.length);
  const next = () => setCurrentIndex((i) => (i + 1) % fileList.length);

  const currentItem = fileList[currentIndex];

  const renderContent = () => {
    if (!currentItem || !currentItem.fileUrl) return null;

    return isVideo(currentItem.fileUrl) ? (
      <video
        autoPlay
        controls
        muted
        className="max-w-[90vw] max-h-[80vh] object-contain select-none -webkit-user-drag-none"
        src={currentItem.fileUrl}
      />
    ) : (
      <img
        alt="preview"
        className="max-w-[90vw] max-h-[80vh] object-contain select-none -webkit-user-drag-none"
        src={currentItem.fileUrl}
      />
    );
  };

  return (
    <div>
      {/* 缩略图列表 */}
      <div className="flex gap-2">
        {fileList.map((item, idx) => {
          const video = isVideo(item.fileUrl);

          return (
            <button
              key={item?.id ?? idx}
              className="cursor-pointer  overflow-hidden flex-shrink-0 relative bg-gray-300"
              style={{
                width: thumbnailSize + "px",
                height: thumbnailSize + "px",
              }}
              onClick={() => openPreview(idx)}
            >
              {video ? (
                <FaPlay className="absolute inset-0 m-auto text-white text-sm" />
              ) : (
                <img
                  alt="thumbnail"
                  className="w-full h-full object-cover select-none -webkit-user-drag-none"
                  src={item.fileUrl}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* 弹窗 */}
      {previewVisible && currentItem && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          role="button"
          onClick={() => setPreviewVisible(false)} // 点击空白处关闭
        >
          <FaTimes
            className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
            onClick={() => setPreviewVisible(false)}
          />

          {/* 内容容器 */}
          <div
            className="relative inline-flex items-center"
            role="button"
            onClick={(e) => e.stopPropagation()} // 阻止冒泡，不让点击内容触发关闭
          >
            {/* 左右按钮贴内容两边 */}
            <FaArrowLeft
              className="absolute left-[-100px] text-white text-3xl cursor-pointer"
              onClick={prev}
            />
            <FaArrowRight
              className="absolute right-[-100px] text-white text-3xl cursor-pointer"
              onClick={next}
            />

            {/* 图片/视频 */}
            <div className="flex items-center justify-center">
              {renderContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaPreviewGroup;
