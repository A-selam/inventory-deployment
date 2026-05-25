import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  inviteUser,
  listUsers,
  type InviteUserRequest,
  type UsersListQuery,
  type UsersListResponse,
} from "@/lib/users";

const usersListKey = (params?: UsersListQuery) =>
  ["users", "list", params ?? {}] as const;

export function useUsersList(params: UsersListQuery) {
  return useQuery<UsersListResponse>({
    queryKey: usersListKey(params),
    queryFn: () => listUsers(params),
  });
}

export function useInviteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InviteUserRequest) => inviteUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
