import React, { useEffect } from 'react';
import { Paper, Typography, CircularProgress, Divider, Grid, Card, CardContent } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';

import CommentSection from './CommentSection';
import { getPost, getPostsBySearch } from '../../actions/posts';
import useStyles from './styles';

const PostDetails = () => {
    const { post, posts, isLoading } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useStyles();
    const { id } = useParams();

    useEffect(() => {
        dispatch(getPost(id));
    }, [id]);

    useEffect(() => {
        if (post) {
            dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }))
        }
    }, [post]);

    if (!post) return null;

    if (isLoading) {
        return <Paper elevation={6} className={classes.loadingPaper}>
            <CircularProgress size="7em" />
        </Paper>
    }

    const recommendedPosts = posts.filter(({ _id }) => _id !== post._id );

    const openPost = (_id) => navigate(`/posts/${_id}`);

    return (
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
            <Grid container className={classes.card}>
                <Grid item xs={12} md={7} className={classes.section}>
                    <Typography variant="h3" component="h3">{post.lecturer}</Typography>
                    <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post.tags.map((tag) => `#${tag} `)}</Typography>
                    <Typography gutterBottom variant="body1" component="p">{post.description}</Typography>
                    <Typography variant="h6">Created by: {post.name}</Typography>
                    <Typography color="textSecondary" variant="body2">{moment(post.createdAt).fromNow()}</Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <CommentSection post={post} />
                    <Divider style={{ margin: '20px 0' }} />
                </Grid>
                <Grid item xs={12} md={5} className={classes.imageSection}>
                    <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.lecturer} />
                </Grid>
            </Grid>
            {recommendedPosts.length !== 0 && (
                <div className={classes.section}>
                    <Typography gutterBottom variant="h5">Similar dosen you might also like:</Typography>
                    <Divider />
                    <Grid container spacing={2} className={classes.recommendedPosts}>
                        {recommendedPosts.map(({ lecturer, description, name, likes, selectedFile, _id }) => (
                            <Grid item xs={12} md={6} lg={3} className={classes.recommend} onClick={() => openPost(_id)} key={_id}>
                                <Card className={classes.recCard}>
                                    <CardContent>
                                        <Typography gutterBottom variant="h6">{lecturer.split(' ').splice(0, 4).join(' ')}...</Typography>
                                        <Typography gutterBottom variant="subtitle2">{name}</Typography>
                                        <Typography gutterBottom variant="subtitle2">{description.split(' ').splice(0, 12).join(' ')}...</Typography>
                                        <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                                        <img src={selectedFile} className={classes.recImg}/>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )).filter((item, i) => i < 4)}
                    </Grid>
                </div>
            )}
        </Paper>
    )
}

export default PostDetails