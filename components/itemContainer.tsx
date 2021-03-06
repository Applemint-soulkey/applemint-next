import { Alert, Card, CircularProgress, Snackbar } from "@mui/material";
import { NextPage } from "next";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "react-query";
import { useRecoilState } from "recoil";
import { apiUrl, linkSnackbarOpenState } from "../store/common";
import { getCollectionItemsCall, ItemProps } from "./api";
import ItemCard from "./itemCard";

const PAGE_SIZE = 20;

const handleNewItemsFetch = async (
  { pageParam = 0 },
  collectionName: string,
  domainFilter = "",
  pathFilter = ""
) => {
  // const res = await fetch(
  //   `${apiUrl}/collection/${collectionName}?cursor=${pageParam}&domain=${domainFilter}&path=${pathFilter}`
  // );
  // const json = await res.json();

  const json = await getCollectionItemsCall(
    pageParam,
    collectionName,
    domainFilter,
    pathFilter
  );
  return {
    data: json,
    nextCursor: json.length > 0 ? pageParam + PAGE_SIZE : undefined,
  };
};

const ItemContainer: NextPage<{
  collectionName: string;
  domainFilter: string;
  pathFilter: string;
}> = ({ collectionName, domainFilter, pathFilter }) => {
  const { ref, inView } = useInView();
  const [isLinkSnackbarOpen, setIsLinkSnackbarOpen] = useRecoilState(
    linkSnackbarOpenState
  );
  // Declare a new query hook
  const {
    data,
    error,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    status,
    refetch,
    remove,
  } = useInfiniteQuery(
    collectionName + "Items",
    (pageParam) =>
      handleNewItemsFetch(pageParam, collectionName, domainFilter, pathFilter),
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    }
  );

  // Call fetchNextPage when the user scrolls to the bottom of the page.
  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView]);

  // Reload when filter changes
  useEffect(() => {
    remove();
    refetch();
  }, [domainFilter, pathFilter]);

  return (
    <div className="flex-1">
      {status === "loading" ? (
        <div id="loading_container" className="mt-5 flex justify-center">
          <CircularProgress />
        </div>
      ) : status === "error" ? (
        <p>{(error as Error).message}</p>
      ) : (
        <div id="item_container" className="mt-5 flex flex-col gap-5">
          <>
            {data?.pages.map((item) =>
              item?.data.map((item: ItemProps) => (
                <ItemCard
                  key={item.id}
                  itemData={item}
                  collectionName={collectionName}
                />
              ))
            )}
          </>
          <div>
            <button
              ref={ref}
              onClick={() => fetchNextPage()}
              disabled={!hasNextPage || isFetchingNextPage}
              className="flex items-center justify-center w-full h-12 bg-gray-200 rounded-md"
            >
              {isFetchingNextPage ? (
                <CircularProgress />
              ) : hasNextPage ? (
                <CircularProgress />
              ) : (
                <></>
              )}
            </button>
          </div>
        </div>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={isLinkSnackbarOpen}
        autoHideDuration={1500}
        onClose={() => setIsLinkSnackbarOpen(false)}
      >
        <Alert className="font-semibold" severity="info">
          Link Copied to Clipboard
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ItemContainer;
