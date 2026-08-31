import baseConfig, {recommendedIgnorePatterns} from '@shelf/prettier-config/oxfmt';

export default {
  ...baseConfig,
  ignorePatterns: [...recommendedIgnorePatterns, 'dist/**', 'lib/**'],
};
