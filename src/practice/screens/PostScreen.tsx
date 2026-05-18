
// import {View, Text} from 'react-native';

// const PostScreen = ()=>{

//     return (
//         <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
//             <Text>Hii this is post screen</Text>
//         </View>
//     )
// }

// export default PostScreen;


import React from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useGetPostsQuery } from '../../practice/store/services/postsApi';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PostScreen = () => {
    const insets = useSafeAreaInsets();

  const { data, isLoading, isError } = useGetPostsQuery();

  if (isLoading) return <ActivityIndicator />;
  if (isError) return <Text>Something went wrong</Text>;

  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>

    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <Text>{item.title}</Text>}
    />
    </View>
  );
};

export default PostScreen;
