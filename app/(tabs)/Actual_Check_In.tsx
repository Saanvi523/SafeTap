import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native-reanimated/lib/typescript/Animated";

export default function ActualCheckIn() {

    const { duration } = useLocalSearchParams<{ duration?: string }>();

    const selectedDuration = duration || "30 min";

    const getDurationInSeconds = (value: string) => {
        if (value.includes("week")) {
            return 7 * 24 * 60 * 60;
        }

        if (value.includes("day")) {
            const days = parseInt(value);
            return days * 24 * 60 * 60;
        }

        if (value.includes("hour")) {
            const hours = parseInt(value);
            return hours * 60 * 60;
        }

        const minutes = parseInt(value);
        return minutes * 60;
    };

    const [totalSeconds, setTotalSeconds] = useState(
        getDurationInSeconds(selectedDuration)
    );

    const [timeRemaining, setTimeRemaining] = useState(
        getDurationInSeconds(selectedDuration)
    );

    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isActive || timeRemaining <= 0) {
            return;
        }

        const timer = setInterval (() => {
            setTimeRemaining((previousTime) => {
                if (previousTime <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return previousTime -1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, timeRemaining]);

    const formatTime = (seconds: number) => {

        const days = Math.floor(seconds / (24 * 60 * 60));
        const hours = Math.floor(
            (seconds % (24 * 60 * 60)) / (24 * 60 * 60)
        );
        const remainingSeconds = seconds % 60;

        if (days > 0) {
            return `${days}:$(String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "0")}:${String(remainingSeconds).padStart(
                2,
                "0"
            )}`;
        }

        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(
                2,
                "0"
            )}:${String(remainingSeconds).padStart(2, "0")}`;
        }

        return `${String(minutes).padStart(
            2,
            "0"
        )}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    const handleImSafe = () => {

        setTimeRemaining(totalSeconds);

        Alert.alert(
            "Check-In Successful",
            "Your check-in has been recorded. The timer has been reset."
        );
    };

    const handleEndCheckIn = () => {

        Alert.alert(
            "End Check-In",
            "Are you sure you want to end this check-in?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "End Check-In",
                    style: "destructive",
                    onPress: () => {
                        setIsActive(false);
                        router.push("/(tabs)/Check_In");
                    },
                },
            ]
        );
    };

    const progress = 
        totalSeconds > 0
            ?timeRemaining / totalSeconds
            : 0;

    return (
        <SafeAreaView style={styles.container}>

            <ScrollView
                
        </SafeAreaView>
    )
}