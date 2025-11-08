import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../core/store/hooks";
import {
  fetchConversations,
  createConversation,
  updateConversation,
  deleteConversation,
  setSelectedConversationId,
  addMessageToConversation,
  updateConversationLocal,
} from "../store/conversationSlice";
import type { Conversation, NewMessage } from "../types";

export const useConversations = () => {
  const dispatch = useAppDispatch();
  const {
    conversations,
    selectedConversationId,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
  } = useAppSelector((state) => state.conversation);

  // Fetch conversations on mount if authenticated
  const isAuthenticated = useAppSelector(
    (state) => state.auth?.isAuthenticated
  );

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchConversations());
    }
  }, [dispatch, isAuthenticated]);

  const selectConversation = (id: string | null) => {
    dispatch(setSelectedConversationId(id));
  };

  const create = async (conversation: Partial<Conversation>) => {
    return await dispatch(createConversation(conversation)).unwrap();
  };

  const update = async (id: string, updates: Partial<Conversation>) => {
    return await dispatch(updateConversation({ id, updates })).unwrap();
  };

  const remove = async (id: string) => {
    await dispatch(deleteConversation(id)).unwrap();
  };

  // Optimistic local update (for immediate UI feedback)
  const addMessage = (conversationId: string, message: NewMessage) => {
    dispatch(addMessageToConversation({ conversationId, message }));
  };

  // Optimistic local update (for immediate UI feedback)
  const updateLocal = (id: string, updates: Partial<Conversation>) => {
    dispatch(updateConversationLocal({ id, updates }));
  };

  const selectedConversation = conversations.find(
    (c) => c.id === selectedConversationId
  );

  return {
    conversations,
    selectedConversation,
    selectedConversationId,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    selectConversation,
    create,
    update,
    remove,
    addMessage,
    updateLocal,
    refetch: () => dispatch(fetchConversations()),
  };
};

