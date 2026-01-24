// MediaService.ts - Handles camera and gallery media selection
// Abstracts expo-image-picker and expo-camera permissions logic

import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Alert, Linking, Platform } from 'react-native';

// Types for media selection results
export interface MediaAsset {
    uri: string;
    type: 'video' | 'image';
    fileName: string;
    mimeType: string;
    duration?: number; // For videos, in seconds (converted from milliseconds)
    width?: number;
    height?: number;
    thumbnailUri?: string;
}

/**
 * Convert milliseconds to seconds
 * expo-image-picker returns duration in milliseconds
 */
function msToSeconds(ms: number | undefined | null): number | undefined {
    if (ms === undefined || ms === null) return undefined;
    return Math.round(ms / 1000);
}

export interface MediaPickerResult {
    success: boolean;
    asset?: MediaAsset;
    error?: string;
}

/**
 * Request camera permissions
 * Shows alert with settings link if denied
 */
export async function requestCameraPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
        Alert.alert(
            'Camera Access Required',
            'Please enable camera access in Settings to record videos.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
        );
        return false;
    }
    return true;
}

/**
 * Request media library permissions
 * Shows alert with settings link if denied
 */
export async function requestMediaLibraryPermission(): Promise<boolean> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
        Alert.alert(
            'Gallery Access Required',
            'Please enable photo library access in Settings to select media.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
        );
        return false;
    }
    return true;
}

/**
 * Launch camera to record video
 */
export async function captureVideo(): Promise<MediaPickerResult> {
    try {
        // Check permission first
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            return { success: false, error: 'Camera permission denied' };
        }

        // Launch camera in video mode
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['videos'],
            allowsEditing: true,
            quality: 1,
            videoMaxDuration: 600, // 10 minutes max
        });

        if (result.canceled || !result.assets?.[0]) {
            return { success: false, error: 'Recording cancelled' };
        }

        const asset = result.assets[0];
        let thumbnailUri: string | undefined;

        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
                time: 0,
                quality: 0.5,
            });
            thumbnailUri = uri;
        } catch (e) {
            console.warn('Failed to generate thumbnail for captured video', e);
        }

        return {
            success: true,
            asset: {
                uri: asset.uri,
                type: 'video',
                fileName: asset.fileName || `video_${Date.now()}.mp4`,
                mimeType: asset.mimeType || 'video/mp4',
                duration: msToSeconds(asset.duration),
                width: asset.width ?? undefined,
                height: asset.height ?? undefined,
                thumbnailUri,
            },
        };
    } catch (error) {
        console.error('Camera capture error:', error);
        return { success: false, error: 'Failed to capture video' };
    }
}

/**
 * Launch camera to take photo
 */
export async function capturePhoto(): Promise<MediaPickerResult> {
    try {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            return { success: false, error: 'Camera permission denied' };
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.9,
        });

        if (result.canceled || !result.assets?.[0]) {
            return { success: false, error: 'Capture cancelled' };
        }

        const asset = result.assets[0];
        return {
            success: true,
            asset: {
                uri: asset.uri,
                type: 'image',
                fileName: asset.fileName || `photo_${Date.now()}.jpg`,
                mimeType: asset.mimeType || 'image/jpeg',
                width: asset.width,
                height: asset.height,
            },
        };
    } catch (error) {
        console.error('Photo capture error:', error);
        return { success: false, error: 'Failed to capture photo' };
    }
}

/**
 * Pick video from gallery
 */
export async function pickVideoFromGallery(): Promise<MediaPickerResult> {
    try {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) {
            return { success: false, error: 'Media library permission denied' };
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['videos'],
            allowsEditing: true,
            quality: 1,
            videoMaxDuration: 600,
        });

        if (result.canceled || !result.assets?.[0]) {
            return { success: false, error: 'Selection cancelled' };
        }

        const asset = result.assets[0];
        let thumbnailUri: string | undefined;

        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
                time: 0,
                quality: 0.5,
            });
            thumbnailUri = uri;
        } catch (e) {
            console.warn('Failed to generate thumbnail for picked video', e);
        }

        return {
            success: true,
            asset: {
                uri: asset.uri,
                type: 'video',
                fileName: asset.fileName || `video_${Date.now()}.mp4`,
                mimeType: asset.mimeType || 'video/mp4',
                duration: msToSeconds(asset.duration),
                width: asset.width ?? undefined,
                height: asset.height ?? undefined,
                thumbnailUri,
            },
        };
    } catch (error) {
        console.error('Video picker error:', error);
        return { success: false, error: 'Failed to pick video' };
    }
}

/**
 * Pick image from gallery
 */
export async function pickImageFromGallery(): Promise<MediaPickerResult> {
    try {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) {
            return { success: false, error: 'Media library permission denied' };
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.9,
        });

        if (result.canceled || !result.assets?.[0]) {
            return { success: false, error: 'Selection cancelled' };
        }

        const asset = result.assets[0];
        return {
            success: true,
            asset: {
                uri: asset.uri,
                type: 'image',
                fileName: asset.fileName || `image_${Date.now()}.jpg`,
                mimeType: asset.mimeType || 'image/jpeg',
                width: asset.width,
                height: asset.height,
            },
        };
    } catch (error) {
        console.error('Image picker error:', error);
        return { success: false, error: 'Failed to pick image' };
    }
}

/**
 * Pick any media (video or image) from gallery
 */
export async function pickMediaFromGallery(): Promise<MediaPickerResult> {
    try {
        const hasPermission = await requestMediaLibraryPermission();
        if (!hasPermission) {
            return { success: false, error: 'Media library permission denied' };
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            allowsEditing: true,
            quality: 1,
            videoMaxDuration: 600,
        });

        if (result.canceled || !result.assets?.[0]) {
            return { success: false, error: 'Selection cancelled' };
        }

        const asset = result.assets[0];
        const isVideo = asset.type === 'video';
        let thumbnailUri: string | undefined;

        if (isVideo) {
            try {
                const { uri } = await VideoThumbnails.getThumbnailAsync(asset.uri, {
                    time: 0,
                    quality: 0.5,
                });
                thumbnailUri = uri;
            } catch (e) {
                console.warn('Failed to generate thumbnail', e);
            }
        }

        return {
            success: true,
            asset: {
                uri: asset.uri,
                type: isVideo ? 'video' : 'image',
                fileName: asset.fileName || `media_${Date.now()}${isVideo ? '.mp4' : '.jpg'}`,
                mimeType: asset.mimeType || (isVideo ? 'video/mp4' : 'image/jpeg'),
                duration: isVideo ? msToSeconds(asset.duration) : undefined,
                width: asset.width ?? undefined,
                height: asset.height ?? undefined,
                thumbnailUri,
            },
        };
    } catch (error) {
        console.error('Media picker error:', error);
        return { success: false, error: 'Failed to pick media' };
    }
}
