import styled from 'styled-components/native';

export const Container = styled.View(({ theme: { backgroundColor } }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor,
}));

export const Title = styled.Text({
  fontSize: 20,
  textAlign: 'center',
});
