import styled from "@emotion/styled";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import SearchIcon from "@material-ui/icons/Search";
import { shell } from "electron";
import { debounce } from "lodash";
import React from "react";
import { useToasts } from "react-toast-notifications";

import { BasicFooter } from "@/components/BasicFooter";
import { DualPane } from "@/components/DualPane";
import { LoadingScreen } from "@/components/LoadingScreen";
import { IconMessage } from "@/components/Message";
import { useReplayFilter } from "@/lib/hooks/useReplayFilter";
import { useSettings } from "@/lib/hooks/useSettings";
import { useReplays } from "@/store/replays";

import { ReplayFileStats } from "../ReplayFileStats";
import { FileList } from "./FileList";
import { FilterToolbar } from "./FilterToolbar";
import { FolderTreeNode } from "./FolderTreeNode";

export const ReplayBrowser: React.FC = () => {
  const searchInputRef = React.createRef<HTMLInputElement>();
  const scrollRowItem = useReplays((store) => store.scrollRowItem);
  const setScrollRowItem = useReplays((store) => store.setScrollRowItem);
  const removeFile = useReplays((store) => store.removeFile);
  const files = useReplays((store) => store.files);
  const selectedItem = useReplays((store) => store.selectedFile.index);
  const selectFile = useReplays((store) => store.selectFile);
  const playFile = useReplays((store) => store.playFile);
  const clearSelectedFile = useReplays((store) => store.clearSelectedFile);
  const loading = useReplays((store) => store.loading);
  const currentFolder = useReplays((store) => store.currentFolder);
  const folders = useReplays((store) => store.folders);
  const init = useReplays((store) => store.init);
  const fileErrorCount = useReplays((store) => store.fileErrorCount);
  const rootSlpPath = useSettings((store) => store.settings.rootSlpPath);
  const { addToast } = useToasts();

  const { filterOptions, setFilterOptions, sortAndFilterFiles, clearFilter } = useReplayFilter();
  const filteredFiles = sortAndFilterFiles(files);
  const numHiddenFiles = files.length - filteredFiles.length;

  React.useEffect(() => {
    init(rootSlpPath);
  }, [rootSlpPath, init]);

  const setSelectedItem = (index: number | null) => {
    if (index === null) {
      clearSelectedFile();
    } else {
      const filePath = filteredFiles[index].fullPath;
      selectFile(index, filePath);
    }
  };

  const playSelectedFile = (index: number) => {
    const filePath = filteredFiles[index].fullPath;
    playFile(filePath);
  };

  const updateFilter = debounce((val) => setFilterOptions(val), 100);

  const deleteFile = (filePath: string) => {
    const success = shell.moveItemToTrash(filePath);
    if (!success) {
      addToast(`Error deleting file: ${filePath}`, { appearance: "error" });
      return;
    }

    // Remove the file from the store
    removeFile(filePath);
    addToast(`File deleted successfully`, { appearance: "success", autoDismiss: true });
  };

  if (folders === null) {
    return null;
  }

  return (
    <Outer>
      {selectedItem !== null ? (
        <ReplayFileStats
          index={selectedItem}
          total={filteredFiles.length}
          file={filteredFiles[selectedItem]}
          onNext={() => setSelectedItem(Math.min(filteredFiles.length - 1, selectedItem + 1))}
          onPrev={() => setSelectedItem(Math.max(0, selectedItem - 1))}
          onClose={() => setSelectedItem(null)}
        />
      ) : (
        <>
          <FilterToolbar disabled={loading} onChange={updateFilter} value={filterOptions} ref={searchInputRef} />
          <div
            style={{
              display: "flex",
              flex: "1",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <DualPane
              id="replay-browser"
              resizable={true}
              minWidth={0}
              maxWidth={300}
              leftStyle={{ backgroundColor: "rgba(0,0,0, 0.3)" }}
              leftSide={
                <List dense={true} style={{ flex: 1, padding: 0 }}>
                  <div style={{ position: "relative", minHeight: "100%" }}>
                    <FolderTreeNode {...folders} />
                    {loading && (
                      <div
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          top: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }}
                      />
                    )}
                  </div>
                </List>
              }
              rightSide={
                loading ? (
                  <LoadingBox />
                ) : filteredFiles.length === 0 ? (
                  <EmptyFolder
                    hiddenFileCount={numHiddenFiles}
                    onClearFilter={() => {
                      if (searchInputRef.current) {
                        searchInputRef.current.value = "";
                      }
                      clearFilter();
                    }}
                  />
                ) : (
                  <FileList
                    folderPath={currentFolder}
                    onDelete={deleteFile}
                    onSelect={(index: number) => setSelectedItem(index)}
                    onPlay={(index: number) => playSelectedFile(index)}
                    files={filteredFiles}
                    scrollRowItem={scrollRowItem}
                    setScrollRowItem={setScrollRowItem}
                  />
                )
              }
            />
          </div>
          <Footer>
            <div>
              <Tooltip title="Open folder">
                <ReplayFolderLink onClick={() => shell.openItem(currentFolder)}>{currentFolder}</ReplayFolderLink>
              </Tooltip>
            </div>
            <div style={{ textAlign: "right" }}>
              {filteredFiles.length} files found. {numHiddenFiles} files filtered.{" "}
              {fileErrorCount > 0 ? `${fileErrorCount} files had errors.` : ""}
            </div>
          </Footer>
        </>
      )}
    </Outer>
  );
};

const LoadingBox: React.FC = () => {
  const progress = useReplays((store) => store.progress);
  let message = "Loading...";
  if (progress !== null) {
    message += ` ${Math.floor((progress.current / progress.total) * 100)}%`;
  }
  return <LoadingScreen message={message} />;
};

const EmptyFolder: React.FC<{
  hiddenFileCount: number;
  onClearFilter: () => void;
}> = ({ hiddenFileCount, onClearFilter }) => {
  const classes = useStyles();
  return (
    <IconMessage Icon={SearchIcon} label="No SLP files found">
      {hiddenFileCount > 0 && (
        <div style={{ textAlign: "center" }}>
          <Typography style={{ marginTop: 20, opacity: 0.6 }}>{hiddenFileCount} files hidden</Typography>
          <Button className={classes.label} color="primary" onClick={onClearFilter} size="small">
            clear filter
          </Button>
        </div>
      )}
    </IconMessage>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    label: {
      textTransform: "lowercase",
      fontSize: 12,
    },
  }),
);

const ReplayFolderLink = styled.div`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const Outer = styled.div`
  display: flex;
  flex-flow: column;
  flex: 1;
  position: relative;
  min-width: 0;
`;

const Footer = styled(BasicFooter)`
  justify-content: space-between;
`;
