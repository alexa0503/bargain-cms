<template>
    <v-container fluid fill-height text-xs-center>
        <v-layout  wrap>
            <v-flex xs12 justify-center align-center>
            </v-flex>
            <v-flex xs12 justify-center align-center>
                账户未激活，请<router-link :to='{name:"setting"}'>完善</router-link>您的店铺信息。
            </v-flex>
        </v-layout>
    </v-container>
</template>