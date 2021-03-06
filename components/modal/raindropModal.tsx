import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { NextPage } from "next";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { raindropCollectionListState } from "../../store/common";
import { ItemProps, makeRaindropCall } from "../api";

const RaindropModal: NextPage<{
  raindropOpen: boolean;
  setRaindropOpen: Dispatch<SetStateAction<boolean>>;
  data: ItemProps;
}> = ({ raindropOpen, setRaindropOpen, data }) => {
  // Set Hooks for Raindrop Dialog
  const [targetCollection, setTargetCollection] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const raindropCollections = useRecoilValue(raindropCollectionListState);
  const OriginTextContent = data.text_content;
  const [textContent, setTextContent] = useState(OriginTextContent);

  useEffect(() => {
    setTextContent(OriginTextContent);
  }, [OriginTextContent]);

  // Handle the user input
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value.length > 0) {
      setTextContent(event.target.value);
    } else {
      setTextContent(OriginTextContent);
    }
  };
  const handleClose = () => setRaindropOpen(false);
  const handleCollectionChange = (event: {
    target: { value: SetStateAction<string> };
  }) => {
    setTargetCollection(event.target.value);
  };
  const handleSubmit = async () => {
    setIsLoading(true);
    const collectionId = raindropCollections.find(
      (collection: { title: string; id: string }) =>
        collection.title === targetCollection
    )?.id;

    let raindropItem: ItemProps = structuredClone(data);
    raindropItem.text_content = textContent;

    if (collectionId) {
      await makeRaindropCall(raindropItem, collectionId);
    } else {
      //show error
    }
    setRaindropOpen(false);
    setIsLoading(false);
  };

  const setDefaultCollection = () => {
    const domainName = data.domain?.split(".")[0];
    const defaultCollection = raindropCollections.find(
      (collection: { title: string; id: string }) =>
        collection.title === domainName
    )?.title;

    if (defaultCollection) {
      setTargetCollection(defaultCollection);
    } else {
      setTargetCollection("etc");
    }
  };

  useEffect(() => {
    setDefaultCollection();
  }, [raindropOpen]);

  return (
    <Dialog open={raindropOpen} onClose={handleClose}>
      <DialogTitle>Save on Raindrop</DialogTitle>
      {isLoading ? (
        <DialogContent className="flex justify-center">
          <CircularProgress />
        </DialogContent>
      ) : (
        <>
          <DialogContent>
            <Box className="flex flex-col gap-3 mt-3 sm:w-96">
              <TextField
                label="Title"
                defaultValue={data.text_content}
                onChange={handleTextChange}
              />
              <TextField label="URL" fullWidth disabled value={data.url} />
              <Select
                value={targetCollection}
                onChange={handleCollectionChange}
              >
                {raindropCollections.map((collection) => (
                  <MenuItem key={collection.id} value={collection.title}>
                    {collection.title}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button className="font-semibold" onClick={handleClose}>
              Cancel
            </Button>
            <Button className="font-semibold" onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default RaindropModal;
