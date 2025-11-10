package com.back.service.post;

import com.back.model.dto.request.PostRequest;
import com.back.model.dto.response.APIResponse;
import com.back.model.dto.response.PostMediaResponse;
import com.back.model.dto.response.PostResponse;
import com.back.model.dto.response.UserSummaryResponse;
import com.back.model.entity.*;
import com.back.model.enums.EFollowStatus;
import com.back.model.enums.EMediaType;
import com.back.model.enums.EVisibility;
import com.back.repository.*;
import com.back.security.principal.CustomUserDetails;
import com.back.service.cloudinary.CloudinaryService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements IPostService{

    private final IPostRepository postRepository;
    private final IUserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final IPostMediaRepository postmediaRepository;
    private final ICommentRepository commentRepository;
    private final IFollowRepository followRepository;
    private final IPostReactionRepository postReactionRepository;
    private final IBlockedUserRepository blockedUserRepository;

    @Override
    @Transactional
    public APIResponse<PostResponse> createPost(PostRequest request){
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();
        if(currentUserDetails == null){
            throw new NoSuchElementException("Không tìm thầy người dùng");
        }

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thầy người dùng"));

        List<MultipartFile> mediaFiles = request.getMediaFiles();
        if (mediaFiles.isEmpty()) {
            throw new IllegalArgumentException("Cần ít nhất 1 file media");
        }
        boolean hasVideo = mediaFiles.stream().anyMatch(f -> Objects.requireNonNull(f.getContentType()).startsWith("video"));
        boolean hasImage = mediaFiles.stream().anyMatch(f -> Objects.requireNonNull(f.getContentType()).startsWith("image"));
        List<PostMediaResponse> mediaList;
        if (hasVideo) {
            try{
                MultipartFile video = mediaFiles.getFirst();
                String url = cloudinaryService.uploadVideo(video);
                mediaList = List.of(PostMediaResponse.builder()
                        .url(url)
                        .type(EMediaType.VIDEO)
                        .build());
            }catch (IOException e){
                throw new RuntimeException("Upload file lỗi", e);
            }

        } else {
            mediaList = mediaFiles.stream().map(file -> {
                try {
                    String url = cloudinaryService.uploadImage(file);
                    return PostMediaResponse.builder()
                            .url(url)
                            .type(EMediaType.IMAGE)
                            .build();
                } catch (IOException e) {
                    throw new RuntimeException("Upload file lỗi", e);
                }
            }).toList();
        }

        Post post = Post.builder()
                .content(request.getContent())
                .visibility(request.getVisibility())
                .user(currentUser)
                .createdAt(LocalDateTime.now())
                .build();

        postRepository.save(post);

        for(PostMediaResponse m : mediaList){
            PostMedia postMedia = PostMedia.builder()
                    .post(post)
                    .url(m.getUrl())
                    .type(m.getType())
                    .build();
            postmediaRepository.save(postMedia);
        }

        PostResponse response = PostResponse.builder()
                .id(post.getId())
                .content(post.getContent().trim())
                .createdAt(post.getCreatedAt())
                .user(UserSummaryResponse.builder()
                        .id(currentUser.getId())
                        .username(currentUser.getUsername())
                        .fullName(currentUser.getFullName())
                        .avatarUrl(currentUser.getAvatarUrl())
                        .build())
                .mediaList(mediaList)
                .totalReactions(0)
                .totalComments(0)
                .reactedByCurrentUser(false)
                .build();

        return APIResponse.<PostResponse>builder()
                .data(response)
                .status(201)
                .message("Bài đăng đã được tạo")
                .build();
    }

    @Override
    public APIResponse<List<PostResponse>> getFeeds() {
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (currentUserDetails == null) {
            throw new NoSuchElementException("Không tìm thấy người dùng");
        }

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<Follow> followings = followRepository.findByFollowerAndStatus(currentUser, EFollowStatus.ACCEPTED);

        List<User> followingUsers = followings.stream()
                .map(Follow::getFollowing)
                .toList();

        followingUsers = Stream.concat(followingUsers.stream(), Stream.of(currentUser))
                .toList();

        List<Post> posts = postRepository.findByUserInOrderByCreatedAtDesc(followingUsers);
        List<Post> postsWithMedia = postRepository.findAllWithMedia(posts);
        return getListAPIResponse(postsWithMedia);
    }

    private APIResponse<List<PostResponse>> getListAPIResponse(List<Post> posts){
        List<PostResponse> response = posts.stream()
                .map(post -> {
                    List<PostMediaResponse> mediaList = post.getMedia().stream()
                            .map(m -> PostMediaResponse.builder()
                                    .id(m.getId())
                                    .url(m.getUrl())
                                    .type(m.getType())
                                    .build())
                            .toList();

                    return PostResponse.builder()
                            .id(post.getId())
                            .content(post.getContent())
                            .createdAt(post.getCreatedAt())
                            .user(UserSummaryResponse.builder()
                                    .id(post.getUser().getId())
                                    .username(post.getUser().getUsername())
                                    .fullName(post.getUser().getFullName())
                                    .avatarUrl(post.getUser().getAvatarUrl())
                                    .build())
                            .mediaList(mediaList)
                            .totalReactions(0)
                            .totalComments(0)
                            .reactedByCurrentUser(false)
                            .build();
                })
                .toList();

        return APIResponse.<List<PostResponse>>builder()
                .data(response)
                .message("Lấy feeds thành công")
                .build();
    }

    @Override
    public APIResponse<List<PostResponse>> getOwnPosts(){
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        if (currentUserDetails == null) {
            throw new NoSuchElementException("Không tìm thấy người dùng");
        }

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        List<Post> posts = postRepository.findByUserByCreateAtDesc(currentUser);
        List<Post> postsWithMedia = postRepository.findAllWithMedia(posts);
        return getListAPIResponse(postsWithMedia);
    }

    @Override
    public APIResponse<List<PostResponse>> getOtherPosts(long userId){
        CustomUserDetails currentUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        boolean isBlockedByMe = blockedUserRepository.existsByUserAndBlockedUser(currentUser, user);
        boolean isBlockedByTarget  = blockedUserRepository.existsByUserAndBlockedUser(user, currentUser);

        if (isBlockedByMe || isBlockedByTarget) {
            return getListAPIResponse(List.of());
        }

        List<Post> posts = postRepository.findByUserByCreateAtDesc(user);
        List<Post> postsWithMedia = postRepository.findAllWithMedia(posts);
        return getListAPIResponse(postsWithMedia);
    }

    @Override
    public APIResponse<PostResponse> changePostVisibility(Long postId, EVisibility visibility){

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy bài đăng"));
        List<PostMedia> postMediaList = postmediaRepository.findByPost(post);

        post.setVisibility(visibility);

        postRepository.save(post);

        List<PostMediaResponse> mediaList = postMediaList.stream()
                .map(m -> PostMediaResponse.builder()
                        .id(m.getId())
                        .url(m.getUrl())
                        .type(m.getType())
                        .build())
                .toList();

        PostResponse response = PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .createdAt(post.getCreatedAt())
                .user(UserSummaryResponse.builder()
                        .id(post.getId())
                        .username(post.getUser().getUsername())
                        .fullName(post.getUser().getFullName())
                        .avatarUrl(post.getUser().getAvatarUrl())
                        .build())
                .mediaList(mediaList)
                .totalReactions(0)
                .totalComments(0)
                .reactedByCurrentUser(false)
                .build();

        return APIResponse.<PostResponse>builder()
                .data(response)
                .status(201)
                .message("Đổi chế độ xem bài viết thành công")
                .build();
    }

    @Override
    @Transactional
    public APIResponse<Void> togglePostReaction(Long postId) {
        CustomUserDetails currentUserDetails =
                (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User currentUser = userRepository.findById(currentUserDetails.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy bài đăng"));

        Optional<PostReaction> existingReaction = postReactionRepository
                .findByPostIdAndUserId(post.getId(), currentUser.getId());

        if (existingReaction.isPresent()) {
            postReactionRepository.delete(existingReaction.get());
            return APIResponse.<Void>builder()
                    .message("Đã bỏ reaction")
                    .status(204)
                    .build();
        } else {
            PostReaction newReaction = PostReaction.builder()
                    .post(post)
                    .user(currentUser)
                    .createdAt(LocalDateTime.now())
                    .build();
            postReactionRepository.save(newReaction);
            return APIResponse.<Void>builder()
                    .message("Đã thêm reaction")
                    .status(201)
                    .build();
        }
    }

    @Override
    public APIResponse<PostResponse> getPostById(Long postId){
        CustomUserDetails currentUserDetails =
                (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy bài đăng"));
        List<PostMedia> postMediaList = postmediaRepository.findByPost(post);

        List<PostMediaResponse> mediaList = postMediaList.stream()
                .map(m -> PostMediaResponse.builder()
                        .id(m.getId())
                        .url(m.getUrl())
                        .type(m.getType())
                        .build())
                .toList();

        PostResponse postResponse = PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .totalReactions(post.getReactions().size())
                .totalComments(commentRepository.findByPost(post).size())
                .reactedByCurrentUser(postReactionRepository.existsByPostIdAndUserId(postId, currentUserDetails.getId()))
                .mediaList(mediaList)
                .createdAt(post.getCreatedAt())
                .user(UserSummaryResponse.builder()
                        .id(post.getUser().getId())
                        .username(post.getUser().getUsername())
                        .fullName(post.getUser().getFullName())
                        .avatarUrl(post.getUser().getAvatarUrl())
                        .build())
                .build();

        return APIResponse.<PostResponse>builder()
                .data(postResponse)
                .status(200)
                .message("Lấy bài đăng thành công")
                .build();
    }
}
