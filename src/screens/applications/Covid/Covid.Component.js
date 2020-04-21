import React from 'react';
import PropTypes from 'prop-types';
import {
    View, Dimensions, PixelRatio,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View as AnimatedView } from 'react-native-animatable';
import { Button, Screen, Header } from 'lib/Components';

import { Wrapper, Heading, Line, Separator } from './Covid.Styles';

const Covid = ({
    sk1, sk2, moments, ephids, getGeneratedSK1, getGeneratedSK2, getGeneratedEphids
}) => {

    const sk1_key = sk1 ? JSON.parse(sk1) : null;
    const sk2_key = sk2 ? JSON.parse(sk2) : null;
    const eph_ids = ephids ? JSON.parse(ephids) : null;

    return (
        <Screen scroll>
            <Wrapper>
                <Line>{'Secret day key 1'}</Line>
                <Line>{sk1_key ? sk1_key['secret_day_key'] : 'no sk1 found'}</Line>
                <Button title="Generate sk1" onPress={getGeneratedSK1} />
                <Separator />
                <Line>{'Secret day key 2'}</Line>
                <Line>{sk2_key ? sk2_key['secret_day_key'] : 'no sk2 found'}</Line>
                <Button title="Generate sk2" onPress={() => getGeneratedSK2(sk1)} />
                <Separator />
                <Line>{'Ephemeral IDs'}</Line>
                {eph_ids ? eph_ids['ephemeral_ids'].map((id, index)=>{
                    return (<Line key={index}>{`${index + 1}. ${id}`}</Line>);
                })   
                : <Line>{'no ephemereal ids found'}</Line>}
                <Button title="Generate ephemeral ids" onPress={() => getGeneratedEphids( moments, sk2_key)} />

            </Wrapper>
        </Screen>
    );
};

Covid.navigationOptions = ({ screenProps: { t } }) => ({
    headerTitle: <Header title={'DP3T'} />,
});

Covid.propTypes = {
    sk1: PropTypes.string,
    sk2: PropTypes.string,
    getGeneratedSK1: PropTypes.func.isRequired,
    getGeneratedSK2: PropTypes.func.isRequired,
    getGeneratedEphids: PropTypes.func.isRequired,
};


export default Covid;
