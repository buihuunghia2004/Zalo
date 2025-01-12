// styles/app/AppBar.styles.ts
import { StyleSheet } from 'react-native';
import { colors } from '../Ui/colors';
import { viewStyle } from '../Ui/views';
import { iconsStyle } from '../Ui/icons';
import { textStyle } from '../Ui/text';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    height: 55,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    borderRadius: 50,
    backgroundColor: 'transparent',
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchWrapper: {
    marginLeft: 30,
    height: '100%',
  },
  searchInputContainer: {
    backgroundColor: 'white',
    height: 34,
    flex: 1,
    marginHorizontal: 10,
    marginLeft: 20,
  },
  searchInput: {
    marginTop: 2,
    fontSize: 10,
    marginHorizontal: 10,
    height: '100%',
  },
  searchPlaceholder: {
    flex: 1,
    opacity: 0.5,
  },
  titleText: {
    ...textStyle.titleText,
  },
  iconRightWrapper: {
    flexDirection: 'row',
  },
});

export default styles;
