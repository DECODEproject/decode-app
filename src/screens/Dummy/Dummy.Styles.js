import styled from 'styled-components/native';

export const Container = styled.View(({ theme: { backgroundColor } }) => ({
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor,
}));

export const Greeting = styled.Text({
  fontSize: 20,
  textAlign: 'center',
  margin: 10,
});

export const Line = styled.Text(({ theme: { primaryColor } }) => ({
  textAlign: 'center',
  color: primaryColor,
  margin: 5,
}));
