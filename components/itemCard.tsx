import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  CardActions,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FlagIcon from "@mui/icons-material/Flag";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import UndoIcon from "@mui/icons-material/Undo";
import LinkIcon from "@mui/icons-material/Link";
import { NextPage } from "next";
import Link from "next/link";
import { deleteCall, ItemProps, keepCall, restoreCall, trashCall } from "./api";
import { QueryClient, useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import {
  raindropModalOpenState,
  bookmarkModalOpenState,
  ModalItemState,
  linkSnackbarOpenState,
} from "../store/common";
import { useState } from "react";

const ItemCard: NextPage<{ itemData: ItemProps; collectionName: string }> = ({
  itemData,
  collectionName,
}) => {
  const setRaindropModalOpen = useSetRecoilState(raindropModalOpenState);
  const setBookmarkModalOpen = useSetRecoilState(bookmarkModalOpenState);
  const setIsLinkSnackbarOpen = useSetRecoilState(linkSnackbarOpenState);
  const setModalItemData = useSetRecoilState(ModalItemState);
  const queryClient = useQueryClient();
  const sendToRaindropDialog = (item: ItemProps) => {
    setModalItemData(item);
    setRaindropModalOpen(true);
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const copyLinkToClipBoard = (url: string) => {
    navigator.clipboard.writeText(url);
    setIsLinkSnackbarOpen(true);
  };

  const sendToBookmarkDialog = (item: ItemProps) => {
    setModalItemData(item);
    setBookmarkModalOpen(true);
  };

  const handleOnMutate = async (
    queryClient: QueryClient,
    collectionName: string
  ) => {
    setIsProcessing(true);

    await queryClient.cancelQueries(collectionName + "Items");
    const previouseItems = await queryClient.getQueryData(
      collectionName + "Items"
    );
    return { previouseItems };
  };

  const handleOnSuccess = (
    queryClient: QueryClient,
    collectionName: string
  ) => {
    queryClient.invalidateQueries(collectionName + "Items");
    queryClient.invalidateQueries(collectionName + "Info");
  };

  const handleOnError = (
    queryClient: QueryClient,
    collectionName: string,
    err: unknown
  ) => {
    console.log("delete error => ", err);
    queryClient.invalidateQueries(collectionName + "Items");
    queryClient.invalidateQueries(collectionName + "Info");
    //TODO show Eror Message Popup
  };

  const trashMutation = useMutation(() => trashCall(itemData, collectionName), {
    onMutate: async () => {
      await handleOnMutate(queryClient, collectionName);
    },
    onSuccess: () => handleOnSuccess(queryClient, collectionName),
    onError: (err) => handleOnError(queryClient, collectionName, err),
    onSettled: () => handleOnSuccess(queryClient, collectionName),
  });

  const deleteMutation = useMutation(
    () => deleteCall(itemData.id, collectionName),
    {
      onMutate: async () => await handleOnMutate(queryClient, collectionName),
      onSuccess: () => handleOnSuccess(queryClient, collectionName),
      onError: (err) => handleOnError(queryClient, collectionName, err),
      onSettled: () => handleOnSuccess(queryClient, collectionName),
    }
  );

  const keepMutation = useMutation(() => keepCall(itemData, collectionName), {
    onMutate: async () => await handleOnMutate(queryClient, collectionName),
    onSuccess: () => handleOnSuccess(queryClient, collectionName),
    onError: (err) => handleOnError(queryClient, collectionName, err),
    onSettled: () => handleOnSuccess(queryClient, collectionName),
  });

  const restoreMutation = useMutation(() => restoreCall(itemData), {
    onMutate: async () => await handleOnMutate(queryClient, collectionName),
    onSuccess: () => handleOnSuccess(queryClient, collectionName),
    onError: (err) => handleOnError(queryClient, collectionName, err),
    onSettled: () => handleOnSuccess(queryClient, collectionName),
  });

  return (
    <Card>
      {isProcessing ? (
        <div className="flex justify-center items-center p-3">
          <CircularProgress />
        </div>
      ) : (
        <>
          <Link href={itemData.url} passHref>
            <a target={`_blank`}>
              <CardActionArea>
                <CardContent>
                  <Typography variant="h5">
                    <span className="font-semibold">
                      {itemData.text_content !== ""
                        ? itemData.text_content
                        : itemData.domain}
                    </span>
                  </Typography>
                  <Typography variant="caption" overflow={"hidden"}>
                    <span>{itemData.url}</span>
                  </Typography>
                </CardContent>
              </CardActionArea>
            </a>
          </Link>
          <CardActions className="flex">
            <div className="flex-1">
              <Chip label={itemData.domain} />
            </div>
            {collectionName === "trash" && (
              <IconButton onClick={() => restoreMutation.mutate()}>
                <UndoIcon />
              </IconButton>
            )}
            <IconButton
              onClick={() => {
                if (collectionName === "trash") {
                  deleteMutation.mutate();
                } else {
                  trashMutation.mutate();
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
            {collectionName === "keep" ||
            collectionName === "bookmark" ||
            collectionName === "trash" ? (
              <></>
            ) : (
              <IconButton onClick={() => keepMutation.mutate()}>
                <FlagIcon />
              </IconButton>
            )}
            {collectionName === "trash" ? (
              <></>
            ) : (
              <>
                <IconButton onClick={() => sendToBookmarkDialog(itemData)}>
                  <BookmarkIcon />
                </IconButton>
                <IconButton onClick={() => sendToRaindropDialog(itemData)}>
                  <InvertColorsIcon />
                </IconButton>
                <IconButton onClick={() => copyLinkToClipBoard(itemData.url)}>
                  <LinkIcon />
                </IconButton>
              </>
            )}
          </CardActions>
        </>
      )}
    </Card>
  );
};

export default ItemCard;
