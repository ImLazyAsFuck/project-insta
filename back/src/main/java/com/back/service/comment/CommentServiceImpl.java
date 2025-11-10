package com.back.service.comment;

import com.back.model.dto.request.CommentRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.CommentResponse;
import com.back.model.dto.response.UserSummaryResponse;
import com.back.model.entity.Comment;
import com.back.model.entity.CommentReaction;
import com.back.model.entity.Post;
import com.back.model.entity.User;
import com.back.model.mapper.CommentMapper;
import com.back.repository.ICommentReactionRepository;
import com.back.repository.ICommentRepository;
import com.back.repository.IPostRepository;
import com.back.repository.IUserRepository;
import com.back.security.principal.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements ICommentService{

    private final ICommentRepository commentRepository;
    private final IPostRepository postRepository;
    private final ICommentReactionRepository commentReactionRepository;
    private final IUserRepository userRepository;

    @Override
    public APIResponse<List<CommentResponse>> getCommentsByPostId(Long postId) {
        CustomUserDetails currentUserDetails =
                (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy bài viết"));

        List<Comment> allComments = commentRepository.findByPost(post);

        List<CommentResponse> rootComments = new ArrayList<>();
        for (Comment c : allComments) {
            if (c.getParentComment() == null) {
                rootComments.add(CommentMapper.mapToCommentResponse(c, currentUser));
            }
        }

        return APIResponse.<List<CommentResponse>>builder()
                .data(rootComments)
                .status(200)
                .message("Lấy danh sách bình luận thành công")
                .build();
    }


    @Override
    public APIResponse<CommentResponse> createComment(CommentRequest commentRequest){
        CustomUserDetails currentUserDetails =
                (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Post post = postRepository.findById(commentRequest.getPostId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy bài viết"));

        Comment parentComment = null;
        Optional<User> replyToUser = Optional.empty();
        if (commentRequest.getParentId() != null) {
            parentComment = commentRepository.findById(commentRequest.getParentId())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy comment cha"));
            replyToUser = Optional.of(parentComment.getUser());
        }

        Comment comment = Comment.builder()
                .content(commentRequest.getContent())
                .user(currentUser)
                .post(post)
                .parentComment(parentComment)
                .childComments(new ArrayList<>())
                .createdAt(LocalDateTime.now())
                .build();

        commentRepository.save(comment);

        CommentResponse response = CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .user(UserSummaryResponse.builder()
                        .id(comment.getUser().getId())
                        .username(comment.getUser().getUsername())
                        .fullName(comment.getUser().getFullName())
                        .avatarUrl(comment.getUser().getAvatarUrl())
                        .build())
                .createdAt(comment.getCreatedAt())
                .reactionCount(0)
                .reactedByCurrentUser(false)
                .replyToUsername(replyToUser.map(User::getUsername).orElse(null))
                .parentId(parentComment != null ? parentComment.getId() : null)
                .childComments(new ArrayList<>())
                .build();

        return APIResponse.<CommentResponse>builder()
                .data(response)
                .status(201)
                .message("Bình luận thành công")
                .build();
    }

    @Override
    public APIResponse<Void> deleteComment(Long commentId){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy comment"));

        commentRepository.delete(comment);

        return APIResponse.<Void>builder()
                .status(204)
                .message("Xóa comment thành công")
                .build();
    }

    @Override
    public APIResponse<Void> toggleCommentReaction(Long commentId){
        CustomUserDetails currentUserDetails =
                (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy comment"));

        Optional<CommentReaction> existingReaction = comment.getReactions().stream()
                .filter(r -> r.getUser().getId().equals(currentUser.getId()))
                .findFirst();

        if (existingReaction.isPresent()) {
            commentReactionRepository.delete(existingReaction.get());
            comment.getReactions().remove(existingReaction.get());
        } else {
            CommentReaction reaction = CommentReaction.builder()
                    .comment(comment)
                    .user(currentUser)
                    .createdAt(LocalDateTime.now())
                    .build();

            commentReactionRepository.save(reaction);
            comment.getReactions().add(reaction);
        }

        return APIResponse.<Void>builder()
                .data(null)
                .status(200)
                .message("Toggle reaction thành công")
                .build();
    }


}
