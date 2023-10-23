import { View, Image } from 'react-native';
import { PanGestureHandler, TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    useAnimatedGestureHandler,
    withSpring,
} from 'react-native-reanimated';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedView = Animated.createAnimatedComponent(View);

export default function EmojiSticker({ imageSize, stickerSource }) {

    const scaleImage = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const onDoubleTap = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.currentScale = scaleImage.value;
        },
        onActive: (event, ctx) => {
            scaleImage.value = ctx.currentScale === 1 ? 2 : 1;
        },
    });

    const onDrag = useAnimatedGestureHandler({
        onStart: (event, context) => {
            context.translateX = translateX.value;
            context.translateY = translateY.value;
        },
        onActive: (event, context) => {
            translateX.value = event.translationX + context.translateX;
            translateY.value = event.translationY + context.translateY;
        },
    });

    const containerStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: translateX.value,
                },
                {
                    translateY: translateY.value,
                },
            ],
        };
    });

    const imageStyle = useAnimatedStyle(() => {
        return {
            width: withSpring(imageSize * scaleImage.value),
            height: withSpring(imageSize * scaleImage.value),
        };
    });

    return (
        <PanGestureHandler onGestureEvent={onDrag}>
            <AnimatedView style={[containerStyle, { top: -350 }]}>
                <TapGestureHandler onGestureEvent={onDoubleTap} numberOfTaps={2}>
                    <AnimatedImage
                        source={stickerSource}
                        resizeMode="contain"
                        style={imageStyle}
                    />
                </TapGestureHandler>
            </AnimatedView>
        </PanGestureHandler >
    );
}