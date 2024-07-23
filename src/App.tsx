import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const PostContainer = styled.div`
  margin-bottom: 20px;
`;

const PostCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const PostCard = styled.div`
  width: 20%;
  padding: 10px;
`;

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
}

const PostsAndUserInfo: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       // Fetch posts from API
  //       const response = await fetch('https://dummyjson.com/posts?_limit=10');
  //       const data = await response.json();

  //       console.log("K___________ data", data.posts);
        

  //       setPosts(data.posts); // Assuming data is an array of posts
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching posts:', error);
  //       setLoading(false);
  //     }
  //   };
  
  //   fetchPosts();
  // }, []);
  

  useEffect(() => {
    // Fetch first 10 posts

    const fetchPosts = async () => {
      axios.get('https://dummyjson.com/posts?_limit=10')
        .then(response => {
          setPosts(response.data.posts.slice(0, 10));

          // Fetch user info based on userId from the first post
          if (response.data.posts.length > 0) {
            const userId = response.data.posts[0].userId;
            axios.get(`https://dummyjson.com/users/${userId}`)
              .then(userResponse => {
                console.log("K___________ userResponse", userResponse.data);

                setUser(userResponse.data);
                setLoading(false);
              })
              .catch(error => {
                console.error('Error fetching user info:', error);
                setLoading(false);
              });
          }
        })
        .catch(error => {
          console.error('Error fetching posts:', error);
          setLoading(false);
        });

    }

    fetchPosts();

  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>First 10 Posts</h2>
      <PostContainer>
        <ul>
          {posts && posts.map((post: Post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      </PostContainer>

      <h2>4 Posts in a Row</h2>
      <PostCardContainer>
        {posts && posts.slice(0, 4).map((post: Post) => (
          <PostCard key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </PostCard>
        ))}
      </PostCardContainer>

      {user && (
        <div>
          <h2>User Information</h2>
          <p>First Name: {user.firstName}</p>
          <p>Last Name: {user.lastName}</p>
        </div>
      )}
    </div>
  );
};

export default PostsAndUserInfo;