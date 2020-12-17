import React from 'react';
import PropTypes from 'prop-types';
import { Button, Screen, Header } from 'lib/Components';
import { Wrapper, Heading, Line, Separator } from './Webinar.Styles';

const Webinar = ({
    result, callZenroom
}) => {

    return (
        <Screen scroll>
            <Wrapper>
                <Line>{'Webinar Example'}</Line>
                <Line>{"Show result"}</Line>
                <Button title="Execute zenroom" onPress={callZenroom} />
                <Separator />
                <Line>{'The result'}</Line>
                <Line>{result}</Line>
            </Wrapper>
        </Screen>
    );
};

Webinar.navigationOptions = ({ screenProps: { t } }) => ({
    headerTitle: <Header title={'WEBINAR'} />,
});

Webinar.propTypes = {
    result: PropTypes.string,
};


export default Webinar;
