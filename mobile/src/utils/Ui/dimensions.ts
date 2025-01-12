
import {Dimensions} from 'react-native';

export const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} = Dimensions.get('window');
    
export const spacing = {
    tiny: 4,
    small: 8,
    smallMedium: 12,
    medium: 16,
    large: 24,
    extraLarge: 32,
};

export const borderRadius = {
    small: 4,
    medium: 8,
    large: 16,
    extraLarge: 32,
    max: 50,
};

export const cardElevation = {
    low: 2,
    medium: 4,
    high: 8,
};
